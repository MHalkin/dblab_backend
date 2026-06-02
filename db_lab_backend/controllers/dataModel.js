const DataModel = require('../models/Relations').DataModel;
const Project = require('../models/Relations').Project;
const fs = require('fs');
const path = require('path');

const create = async (req, res) => {
    try {
        const { id } = req.params;
        if (!req.file) return res.status(400).json({ message: "No file uploaded" });

        const project = await Project.findByPk(id);
        if (!project || project.user_id !== req.user.id) {
            fs.unlinkSync(req.file.path);
            return res.status(403).json({ message: "Access denied" });
        }

        if (project.isarchived) {
            fs.unlinkSync(req.file.path);
            return res.status(403).json({ message: "Cannot delete an archived project." });
        }

        const newModel = await DataModel.create({
            project_id: id,
            file: req.file.filename,
            type: req.body.type,
            upload_date: new Date()
        });

        return res.status(201).json(newModel);
    } catch (error) {
        if (fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
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

        if (project.isarchived) {
            return res.status(403).json({ message: "Cannot delete an archived project." });
        }

        const filePath = path.join(__dirname, '../uploads', model.file);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

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
        const filePath = path.join(__dirname, '../uploads', safeFilename);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'File not found' });
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