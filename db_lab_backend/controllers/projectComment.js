const { Project, Expertise, ProjectComment } = require('../models/Relations');

const isParentArchived = async (comment) => {
    if (comment.project_id) {
        const project = await Project.findByPk(comment.project_id);
        return project ? project.isarchived : false;
    }

    if (comment.expertise_id) {
        const expertise = await Expertise.findByPk(comment.expertise_id, {
            include: [{ model: Project }]
        });
        return (expertise && expertise.Project) ? expertise.Project.isarchived : false;
    }
    return false;
};

const create = async (req, res) => {
    try {
        const { text, reply_to_id, projectId, expertiseId } = req.body;

        if (projectId) {
            const proj = await Project.findByPk(projectId);
            if (proj && proj.isarchived) return res.status(403).json({ message: "Project is archived" });
        }
        if (expertiseId) {
            const exp = await Expertise.findByPk(expertiseId, { include: [Project] });
            if (exp && exp.Project && exp.Project.isarchived) return res.status(403).json({ message: "Project is archived" });
        }

        const newComment = await ProjectComment.create({
            user_id: req.user.id,
            project_id: projectId || null,
            expertise_id: expertiseId || null,
            previous_comment_id: reply_to_id || null,
            text,
            date: new Date()
        });
        return res.status(201).json(newComment);
    } catch (e) { return res.status(500).json({ error: e.message }); }
};

const update = async (req, res) => {
    try {
        const comment = await ProjectComment.findByPk(req.params.id);
        if (!comment) return res.status(404).json({ message: "Comment not found" });

        if (await isParentArchived(comment)) {
            return res.status(403).json({ message: "Cannot modify: Project is archived" });
        }

        if (comment.user_id !== req.user.id) return res.status(403).json({ message: "Forbidden" });

        comment.text = req.body.text;
        await comment.save();
        return res.json(comment);
    } catch (e) { return res.status(500).json({ error: e.message }); }
};

const deleter = async (req, res) => {
    try {
        const comment = await ProjectComment.findByPk(req.params.id);
        if (!comment) return res.status(404).json({ message: "Comment not found" });

        if (await isParentArchived(comment)) {
            return res.status(403).json({ message: "Cannot delete: Project is archived" });
        }

        if (comment.user_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Forbidden" });
        }

        comment.text = "[видалено]";
        await comment.save();
        return res.json({ message: "Comment deleted" });
    } catch (e) { return res.status(500).json({ error: e.message }); }
};

const getThread = async (req, res) => {
    try {
        const { id } = req.params;
        const root = await ProjectComment.findByPk(id);
        if (!root) return res.status(404).json({ message: "Not found" });

        const fetchReplies = async (parentId, depth) => {
            if (depth >= 6) return [];
            const replies = await ProjectComment.findAll({ where: { previous_comment_id: parentId } });
            for (let reply of replies) {
                reply.dataValues.replies = await fetchReplies(reply.comment_id, depth + 1);
            }
            return replies;
        };

        root.dataValues.replies = await fetchReplies(id, 1);
        return res.json(root);
    } catch (e) { return res.status(500).json({ error: e.message }); }
};

module.exports = { create, update, deleter, getThread };