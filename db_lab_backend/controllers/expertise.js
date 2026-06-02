const Expertise = require('../models/Expertise');
const Project = require('../models/Project');

const create = async (req, res) => {
    try {
        const { projectId } = req.params;
        const project = await Project.findByPk(projectId);

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        if (project.isarchived) {
            return res.status(403).json({ message: "Cannot add expertise to an archived project." });
        }

        const newExpertise = await Expertise.create({
            user_id: req.user.id,
            project_id: projectId,
            begin_date: new Date(),
            end_date: null
        });

        return res.status(201).json(newExpertise);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const update = async (req, res) => {
    try {
        const expertise = await Expertise.findByPk(req.params.id, {
            include: [{ model: Project }]
        });
        if (!expertise) return res.status(404).json({ message: "Not found" });

        if (expertise.user_id !== req.user.id) {
            return res.status(403).json({ message: "Access denied" });
        }

        if (expertise.Project && expertise.Project.isarchived) {
            return res.status(403).json({ message: "Cannot modify expertise: Project is archived." });
        }

        expertise.mark = req.body.score;
        expertise.text = req.body.review_text;
        expertise.end_date = new Date();

        await expertise.save();
        return res.status(200).json(expertise);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const deleter = async (req, res) => {
    try {
        const expertise = await Expertise.findByPk(req.params.id, {
            include: [{ model: Project }]
        });
        if (!expertise) return res.status(404).json({ message: "Not found" });

        const isCompleted = expertise.end_date !== null;
        const isAdmin = req.user.role === 'admin';
        const isOwner = expertise.user_id === req.user.id;

        if (expertise.Project && expertise.Project.isarchived) {
            return res.status(403).json({ message: "Cannot modify expertise: Project is archived." });
        }

        if (isCompleted && !isAdmin) {
            return res.status(403).json({ message: "Cannot delete finalized expertise" });
        }

        if (!isCompleted && !isOwner && !isAdmin) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        await expertise.destroy();
        return res.status(200).json({ message: "Deleted" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    create,
    deleter,
    update,
};