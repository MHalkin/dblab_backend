const path = require('path');
const fs = require('fs').promises;
const fsSync = require('fs');
const sharp = require('sharp');
const Relations = require('../models/Relations');
const Imbed = Relations.Imbed;
const Expertise = Relations.Expertise;
const Project = Relations.Project;

const create = async (req, res) => {
    const tempPath = req.file ? req.file.path : null;

    try {
        const { expertiseId } = req.params;
        if (!req.file) return res.status(400).json({ message: "No file uploaded" });

        const expertise = await Expertise.findByPk(expertiseId, {
            include: [{ model: Project }]
        });

        if (!expertise) {
            if (tempPath) try { await fs.unlink(tempPath); } catch (e) { }
            return res.status(404).json({ message: "Expertise record not found" });
        }

        const isAdmin = req.user.role === 'admin';
        if (expertise.user_id !== req.user.id) {
            if (tempPath) try { await fs.unlink(tempPath); } catch (e) { }
            return res.status(403).json({ message: "Access denied" });
        }
        if (expertise.Project?.isarchived) {
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

            if (normalizeExt(claimedExt) !== normalizeExt(`.${detectedType.ext}`) || claimedMime !== detectedType.mime) {
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

                if (byteBuffer.slice(0, bytesRead).includes(0x00)) {
                    if (tempPath) try { await fs.unlink(tempPath); } catch (e) { }
                    return res.status(400).json({ message: "Security Alert: Spoofed file type detected." });
                }
            }
        }

        const permanentDir = path.join(__dirname, '../uploads/data');
        await fs.mkdir(permanentDir, { recursive: true });
        const permanentPath = path.join(permanentDir, req.file.filename);

        await fs.copyFile(tempPath, permanentPath);
        await fs.unlink(tempPath);

        const newImbed = await Imbed.create({
            expertise_id: expertiseId,
            link: req.file.filename
        });

        return res.status(201).json(newImbed);
    } catch (error) {
        if (tempPath) try { await fs.unlink(tempPath); } catch (e) { }
        return res.status(500).json({ message: error.message });
    }
};

const deleter = async (req, res) => {
    try {
        const { id } = req.params;
        const imbed = await Imbed.findByPk(id, {
            include: [{ model: Expertise, include: [Project] }]
        });

        if (!imbed) return res.status(404).json({ message: "Imbed not found" });

        const isAdmin = req.user.role === 'admin';
        const isOwner = imbed.Expertise && imbed.Expertise.user_id === req.user.id;
        const isArchived = imbed.Expertise?.Project?.isarchived;

        if (isArchived && !isAdmin) return res.status(403).json({ message: "Cannot delete: Project is archived." });
        if (!isOwner && !isAdmin) return res.status(403).json({ message: "Access denied" });

        const filePath = path.join(__dirname, '../uploads/data', imbed.link);
        try { await fs.unlink(filePath); } catch (err) { }
        await imbed.destroy();

        return res.status(200).json({ message: "Imbed and file deleted" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const servePhotoFile = async (req, res) => {
    try {
        const { filename } = req.params;
        const safeFilename = path.basename(filename);
        const filePath = path.join(__dirname, '../uploads/data', safeFilename);

        if (!fsSync.existsSync(filePath)) return res.status(404).json({ message: 'File not found' });

        const ext = path.extname(safeFilename).toLowerCase();
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

        if (imageExtensions.includes(ext)) {
            res.setHeader('Content-Disposition', `inline; filename="${safeFilename}"`);
            res.setHeader('Content-Type', ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg');
        } else if (ext === '.json') {
            res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}"`);
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
        } else {
            res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}"`);
            res.setHeader('Content-Type', 'application/octet-stream');
        }

        return res.sendFile(filePath);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = { create, deleter, servePhotoFile };