const path = require('path');
const fs = require('fs').promises;
const Expertise = require('../models/Expertise');
const Project = require('../models/Project');
const Imbed = require('../models/Imbed');

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

        if (project.status !== 'reviewed') {
            project.status = 'in-review';
            await project.save();
        }

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

        if (expertise.Project) {
            expertise.Project.status = 'reviewed';
            await expertise.Project.save();
        }

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

        if (expertise.Project && expertise.Project.isarchived && !isAdmin) {
            return res.status(403).json({ message: "Cannot modify expertise: Project is archived." });
        }

        if (isCompleted && !isAdmin) {
            return res.status(403).json({ message: "Cannot delete finalized expertise" });
        }

        if (!isCompleted && !isOwner && !isAdmin) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const imbeds = await Imbed.findAll({ where: { expertise_id: expertise.expertise_id } });
        const targetDir = path.join(__dirname, '../uploads/data');

        for (const imbed of imbeds) {
            if (imbed.link) {
                const filePath = path.join(targetDir, path.basename(imbed.link));
                try {
                    await fs.unlink(filePath);
                } catch (err) {
                    console.error(`Cleanup notice: File ${imbed.link} not found.`);
                }
            }
        }

        const projectId = expertise.project_id;
        const projectInstance = expertise.Project;

        await expertise.destroy();

        if (projectInstance) {
            const remaining = await Expertise.findAll({
                where: { project_id: projectId }
            });

            if (remaining.length === 0) {
                projectInstance.status = 'pending';
            } else {
                const hasFinishedExpertise = remaining.some(e => e.end_date !== null);
                projectInstance.status = hasFinishedExpertise ? 'reviewed' : 'in-review';
            }

            await projectInstance.save();
        }

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