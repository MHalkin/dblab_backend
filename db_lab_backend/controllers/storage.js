const fs = require('fs');
const path = require('path');
const Imbed = require('../models/Imbed');
const DataModel = require('../models/DataModel');
const Teacher = require('../models/Teacher');
const Material = require('../models/Material');
const { exec } = require('child_process');
const { sequelize } = require("../config/db.config");

const getFolderSizeAsync = async (dirPath) => {
    let size = 0;
    if (!fs.existsSync(dirPath)) return 0;

    const dir = await fs.promises.opendir(dirPath);

    for await (const entry of dir) {
        const entryPath = path.join(dirPath, entry.name);

        if (entry.isDirectory()) {
            size += await getFolderSizeAsync(entryPath);
        } else if (entry.isFile()) {
            const stats = await fs.promises.stat(entryPath);
            size += stats.size;
        }
    }
    return size;
};

const getDbStorage = async (req, res) => {
    try {
        let query = "SELECT CONCAT(ROUND(SUM(data_length + index_length) / 1024 / 1024, 2), ' MB') AS size FROM information_schema.TABLES WHERE table_schema = DATABASE();";

        const [results] = await sequelize.query(query);
        return res.status(200).json({
            size: results[0]?.size || results[0]?.size_mb || "Unknown"
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getUploadsStorage = async (req, res) => {
    try {
        const uploadsPath = path.join(__dirname, '../uploads');

        const sizeInBytes = await getFolderSizeAsync(uploadsPath);
        const sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(2);

        return res.status(200).json({
            sizeBytes: sizeInBytes,
            sizeMB: `${sizeInMB} MB`
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getDiskStorage = async (req, res) => {
    exec('df -h /', (error, stdout, stderr) => {
        if (error) {
            return res.status(500).json({ message: "Failed to read disk space", error: error.message });
        }

        try {
            const lines = stdout.trim().split('\n');
            const diskInfo = lines[1].replace(/\s+/g, ' ').split(' ');

            return res.status(200).json({
                totalSpace: diskInfo[1],
                usedSpace: diskInfo[2],
                availableSpace: diskInfo[3],
                usedPercentage: diskInfo[4]
            });
        } catch (parseError) {
            return res.status(500).json({ message: "Failed to parse disk utility output", error: parseError.message });
        }
    });
};

const cleanup = async (req, res) => {
    const taskMap = [
        { dir: 'data', model: Imbed, field: 'link' },
        { dir: 'data', model: DataModel, field: 'file' },
        { dir: 'teacher', model: Teacher, field: 'photo' },
        { dir: 'material', model: Material, field: 'file' }
    ];

    let totalDeleted = 0;

    try {
        for (const task of taskMap) {
            const fullDirPath = path.join(__dirname, '../uploads', task.dir);

            if (!fs.existsSync(fullDirPath)) continue;

            const files = await fs.promises.readdir(fullDirPath);

            for (const file of files) {
                const filePath = path.join(fullDirPath, file);
                const stats = await fs.promises.stat(filePath);

                if (stats.isDirectory()) continue;

                let found = false;

                if (task.dir === 'data') {
                    const inImbed = await Imbed.findOne({ where: { link: file } });
                    const inDataModel = await DataModel.findOne({ where: { file: file } });
                    if (inImbed || inDataModel) found = true;
                } else {
                    found = await task.model.findOne({
                        where: { [task.field]: file }
                    });
                }

                if (!found) {
                    await fs.promises.unlink(filePath);
                    console.log(`Deleted orphan: ${task.dir}/${file}`);
                    totalDeleted++;
                }
            }
        }

        const tempDirPath = path.join(__dirname, '../uploads-temp');

        try {
            await fs.promises.access(tempDirPath);

            const tempFiles = await fs.promises.readdir(tempDirPath);

            for (const file of tempFiles) {
                const filePath = path.join(tempDirPath, file);
                const stats = await fs.promises.stat(filePath);

                if (!stats.isDirectory()) {
                    await fs.promises.unlink(filePath);
                }
            }
        } catch (err) {
            console.warn("Temp directory cleanup skipped or failed:", err.message);
        }

        return res.status(200).json({
            message: "Cleanup finished",
            deletedCount: totalDeleted
        });
    } catch (error) {
        console.error("Cleanup error:", error);
        return res.status(500).json({ message: "Error during cleanup", error: error.message });
    }
};

module.exports = {
    getDbStorage,
    getUploadsStorage,
    getDiskStorage,
    cleanup
};