const path = require('path');
const fs = require('fs').promises;
const fsSync = require('fs');
const Material = require('../models/Relations').Material;
const Event = require('../models/Relations').Event;
require('dotenv').config();

const create = async (req, res) => {
    try {
        const { event_Id, material_name, material_type } = req.body;
        const material = await Material.create({ event_Id, material_name, material_type });
        return res.status(201).json(material);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const uploadFile = async (req, res) => {
    const tempPath = req.file ? req.file.path : null;

    try {
        const { material_Id } = req.params;

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded.' });
        }

        const material = await Material.findByPk(material_Id);
        if (!material) {
            if (tempPath) try { await fs.unlink(tempPath); } catch (e) { }
            return res.status(404).json({ message: 'Material not found. File wiped.' });
        }

        const { fileTypeFromFile } = await import('file-type');
        const detectedType = await fileTypeFromFile(tempPath);

        const claimedMime = req.file.mimetype;
        const claimedExt = path.extname(req.file.originalname).toLowerCase();

        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.pdf'];
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

        const normalizeExt = (ext) => ext === '.jpeg' ? '.jpg' : ext;

        if (!detectedType || !allowedMimeTypes.includes(detectedType.mime)) {
            if (tempPath) try { await fs.unlink(tempPath); } catch (e) { }
            return res.status(400).json({
                message: 'Security Alert: Invalid file type.'
            });
        }

        const actualMime = detectedType.mime;
        const actualExt = `.${detectedType.ext}`;

        if (normalizeExt(claimedExt) !== normalizeExt(actualExt) || claimedMime !== actualMime) {
            if (tempPath) try { await fs.unlink(tempPath); } catch (e) { }
            return res.status(400).json({
                message: 'Security Alert: Mismatch detected.'
            });
        }

        if (!allowedExtensions.includes(normalizeExt(claimedExt))) {
            if (tempPath) try { await fs.unlink(tempPath); } catch (e) { }
            return res.status(400).json({ message: 'Security Alert: Extension is not permitted.' });
        }

        if (material.file) {
            const oldPath = path.join(__dirname, '../uploads/material', material.file);
            try { await fs.unlink(oldPath); } catch (e) { }
        }

        const permanentDir = path.join(__dirname, '../uploads/material');
        await fs.mkdir(permanentDir, { recursive: true });

        const permanentPath = path.join(permanentDir, req.file.filename);
        await fs.copyFile(tempPath, permanentPath);
        await fs.unlink(tempPath);

        await material.update({
            file: req.file.filename,
        });

        return res.status(200).json({
            message: 'File verified, sanitized, and saved successfully.',
            filename: req.file.filename
        });

    } catch (error) {
        if (tempPath) try { await fs.unlink(tempPath); } catch (e) { }
        return res.status(500).json({ message: error.message });
    }
};

const serveMaterialFile = async (req, res) => {
    try {
        const { filename } = req.params;
        const safeFilename = path.basename(filename);
        const filePath = path.join(__dirname, '../uploads/material', safeFilename);

        if (!fsSync.existsSync(filePath)) {
            return res.status(404).json({ message: 'File not found.' });
        }

        res.setHeader('Content-Disposition', `inline; filename="${safeFilename}"`);

        const ext = path.extname(safeFilename).toLowerCase();
        const mimeTypes = {
            '.pdf': 'application/pdf',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.webp': 'image/webp'
        };

        res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
        return res.sendFile(filePath);

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getAll = async (req, res) => {
    try {
        const materials = await Material.findAll();
        return res.status(200).json(materials || []);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getFromDb = async (req, res) => {
    try {
        const materials = await Material.findAll({
            include: [{ model: Event, attributes: ['event_name'] }]
        });
        const result = materials.map(m => {
            const { Event, ...data } = m.toJSON();
            return { ...data, event_name: Event?.event_name };
        });
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const deleter = async (req, res) => {
    try {
        const { material_Id } = req.params;
        const material = await Material.findByPk(material_Id);

        if (material && material.file) {
            const filePath = path.join(__dirname, '../uploads/material', material.file);
            try { await fs.unlink(filePath); } catch (e) { }
        }

        await Material.destroy({ where: { material_Id } });
        return res.status(200).json({ message: 'Material and file removed' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const update = async (req, res) => {
    try {
        const { material_Id } = req.params;
        const { event_Id, material_name, material_type } = req.body;
        await Material.update({ event_Id, material_name, material_type }, { where: { material_Id } });
        return res.status(200).json({ message: 'Material details updated' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    create, getAll, deleter, update, getFromDb, uploadFile, serveMaterialFile
};