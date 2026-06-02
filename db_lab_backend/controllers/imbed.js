const Imbed = require('../models/Imbed');
const Expertise = require('../models/Expertise');
const Project = require('../models/Project');
const fs = require('fs');
const path = require('path');

const create = async (req, res) => {
    try {
        const { expertiseId } = req.params;

        const expertise = await Expertise.findByPk(expertiseId, {
            include: [{ model: Project }]
        });

        if (!expertise) {
            fs.unlinkSync(req.file.path);
            return res.status(404).json({ message: "Expertise record not found" });
        }

        if (expertise.Project && expertise.Project.isarchived) {
            fs.unlinkSync(req.file.path);
            return res.status(403).json({ message: "Cannot modify expertise: Project is archived." });
        }

        if (expertise.user_id !== req.user.id) {
            fs.unlinkSync(req.file.path);
            return res.status(403).json({ message: "Access denied" });
        }

        const newAttachment = await Imbed.create({
            expertise_id: expertiseId,
            link: req.file.filename
        });

        return res.status(201).json(newAttachment);
    } catch (error) {
        if (fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        return res.status(500).json({ message: error.message });
    }
};

const deleter = async (req, res) => {
    try {
        const attachment = await Imbed.findByPk(req.params.id, {
            include: [{
                model: Expertise,
                include: [{ model: Project }]
            }]
        });
        if (!attachment) return res.status(404).json({ message: "Not found" });

        if (attachment.Expertise.Project && attachment.Expertise.Project.isarchived) {
            return res.status(403).json({ message: "Cannot modify expertise: Project is archived." });
        }

        if (attachment.Expertise.user_id !== req.user.id) {
            return res.status(403).json({ message: "Access denied" });
        }

        const filePath = path.join(__dirname, '../uploads', attachment.link);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await attachment.destroy();
        return res.status(200).json({ message: "Deleted" });
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