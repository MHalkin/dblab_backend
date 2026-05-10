const path = require('path');
const fs = require('fs');
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
    try {
        const { material_Id } = req.params;

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded.' });
        }

        const material = await Material.findByPk(material_Id);

        if (!material) {
            if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
            return res.status(404).json({ message: 'Material not found. File wiped.' });
        }

        if (material.file) {
            const oldFilename = material.file.split('/').pop();
            const oldPath = path.join(__dirname, '../uploads', oldFilename);
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }

        const newLink = `${req.protocol}://${req.get('host')}${process.env.LINK}/material/file/${req.file.filename}`;

        await material.update({ file: newLink });

        return res.status(200).json({
            message: 'File uploaded and link saved',
            link: newLink
        });
    } catch (error) {
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        return res.status(500).json({ message: error.message });
    }
};

const serveMaterialFile = async (req, res) => {
    try {
        const { filename } = req.params;
        const filePath = path.join(__dirname, '../uploads', filename);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'File not found' });
        }

        return res.sendFile(filePath);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getAll = async (req, res) => {
    try {
        const materials = await Material.findAll();

        if (!materials || materials.length === 0) {
            return res.status(404).json({ message: 'material not found.' });
        }

        return res.status(200).json(materials);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getFromDb = async (req, res) => {
    try {
        const materials = await Material.findAll({
            include: [
                {
                    model: Event,
                    attributes: ['event_name']
                },
            ]
        });
        const result = materials.map(material => {
            const { Event, ...materialData } = material.toJSON();
            return {
                ...materialData,
                event_name: Event.event_name,
            };
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
            const filename = material.file.split('/').pop();
            const filePath = path.join(__dirname, '../uploads', filename);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
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
    create,
    getAll,
    deleter,
    update,
    getFromDb,
    uploadFile,
    serveMaterialFile
};