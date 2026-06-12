const DataModel = require('../models/Relations').DataModel;
const Project = require('../models/Relations').Project;
const fs = require('fs').promises;
const fsSync = require('fs');
const sharp = require('sharp');
const path = require('path');

const create = async (req, res) => {
    const tempPath = req.file ? req.file.path : null;

    try {
        const { id } = req.params;

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const project = await Project.findByPk(id);
        if (!project || project.user_id !== req.user.id) {
            if (tempPath) try { await fs.unlink(tempPath); } catch (e) { }
            return res.status(403).json({ message: "Access denied" });
        }

        if (project.isarchived) {
            if (tempPath) try { await fs.unlink(tempPath); } catch (e) { }
            return res.status(403).json({ message: "Cannot upload files to an archived project." });
        }

        const claimedMime = req.file.mimetype.toLowerCase();
        const claimedExt = path.extname(req.file.originalname).toLowerCase();

        const allowedBinaryExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
        const allowedBinaryMimes = ['image/jpeg', 'image/png', 'image/webp'];
        const allowedTextExtensions = ['.txt', '.sql', '.json'];

        const normalizeExt = (ext) => ext === '.jpeg' ? '.jpg' : ext;

        const { fileTypeFromFile } = await import('file-type');
        const detectedType = await fileTypeFromFile(tempPath);

        if (detectedType) {
            if (!allowedBinaryMimes.includes(detectedType.mime)) {
                if (tempPath) try { await fs.unlink(tempPath); } catch (e) { }
                return res.status(400).json({ message: "Security Alert: Unsupported binary file type." });
            }

            const metadata = await sharp(tempPath).metadata();
            if (metadata.width > 4096 || metadata.height > 4096) {
                if (tempPath) try { await fs.unlink(tempPath); } catch (e) { }
                return res.status(400).json({ message: "Security Alert: Image dimensions exceed allowed limits." });
            }

            const actualMime = detectedType.mime;
            const actualExt = `.${detectedType.ext}`;

            if (normalizeExt(claimedExt) !== normalizeExt(actualExt) || claimedMime !== actualMime) {
                if (tempPath) try { await fs.unlink(tempPath); } catch (e) { }
                return res.status(400).json({ message: "Security Alert: Extension and content mismatch." });
            }

            if (!allowedBinaryExtensions.includes(normalizeExt(claimedExt))) {
                if (tempPath) try { await fs.unlink(tempPath); } catch (e) { }
                return res.status(400).json({ message: "Security Alert: Extension not permitted." });
            }
        } else {
            if (!allowedTextExtensions.includes(claimedExt)) {
                if (tempPath) try { await fs.unlink(tempPath); } catch (e) { }
                return res.status(400).json({ message: "Security Alert: Invalid file extension." });
            }

            if (claimedExt === '.json') {
                try {
                    const rawContent = await fs.readFile(tempPath, 'utf8');
                    JSON.parse(rawContent);
                } catch (parseError) {
                    if (tempPath) try { await fs.unlink(tempPath); } catch (e) { }
                    return res.status(400).json({ message: "Security Alert: Corrupted or structurally invalid JSON file." });
                }
            } else {
                const fd = await fs.open(tempPath, 'r');
                const byteBuffer = Buffer.alloc(4096);

                const { bytesRead } = await fd.read(byteBuffer, 0, 4096, 0);
                await fd.close();

                const isBinaryInput = byteBuffer.slice(0, bytesRead).includes(0x00);

                if (isBinaryInput) {
                    if (tempPath) try { await fs.unlink(tempPath); } catch (e) { }
                    return res.status(400).json({
                        message: "Security Alert: Spoofed file type. Binary data detected inside text container."
                    });
                }
            }
        }

        const permanentDir = path.join(__dirname, '../uploads/data');
        await fs.mkdir(permanentDir, { recursive: true });

        const permanentPath = path.join(permanentDir, req.file.filename);

        await fs.copyFile(tempPath, permanentPath);
        await fs.unlink(tempPath);

        const newModel = await DataModel.create({
            project_id: id,
            file: req.file.filename,
            type: req.body.type,
            upload_date: new Date()
        });

        return res.status(201).json(newModel);

    } catch (error) {
        if (tempPath) try { await fs.unlink(tempPath); } catch (e) { }
        return res.status(500).json({ message: error.message });
    }
};

const deleter = async (req, res) => {
    try {
        const { id } = req.params;

        const model = await DataModel.findByPk(id);
        if (!model) return res.status(404).json({ message: "Model not found" });
        const project = await Project.findByPk(model.project_id);
        if (!project || project.user_id !== req.user.id) {
            return res.status(403).json({ message: "Access denied" });
        }

        if (project.isarchived && req.user.role !== "admin") {
            return res.status(403).json({ message: "Cannot delete an archived project." });
        }

        const filePath = path.join(__dirname, '../uploads/data', model.file);

        try {
            await fs.access(filePath);
            await fs.unlink(filePath);
        } catch (err) { }

        await model.destroy();

        return res.status(200).json({ message: "Model deleted" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const servePhotoFile = async (req, res) => {
    try {
        const { filename } = req.params;

        const safeFilename = path.basename(filename);
        const filePath = path.join(__dirname, '../uploads/data', safeFilename);

        if (!fsSync.existsSync(filePath)) {
            return res.status(404).json({ message: 'File not found' });
        }

        const ext = path.extname(safeFilename).toLowerCase();
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
        const textExtensions = ['.txt', '.sql'];

        if (imageExtensions.includes(ext)) {
            res.setHeader('Content-Disposition', `inline; filename="${safeFilename}"`);

            if (ext === '.png') {
                res.setHeader('Content-Type', 'image/png');
            } else if (ext === '.webp') {
                res.setHeader('Content-Type', 'image/webp');
            } else {
                res.setHeader('Content-Type', 'image/jpeg');
            }
        } else if (ext === '.json') {
            res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}"`);
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
        } else if (textExtensions.includes(ext)) {
            res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}"`);
            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        } else {
            res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}"`);
            res.setHeader('Content-Type', 'application/octet-stream');
        }

        return res.sendFile(filePath);

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    create,
    deleter,
    servePhotoFile
};