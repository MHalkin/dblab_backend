const { ExpertRequest, User } = require('../models/Relations');
const { Op } = require('sequelize');

const getAll = async (req, res) => {
    try {
        const { status } = req.query;
        const whereClause = status ? { status } : {};

        const requests = await ExpertRequest.findAll({
            where: whereClause,
            include: [{
                model: User,
                attributes: { exclude: ['password'] }
            }]
        });
        return res.status(200).json(requests);
    } catch (error) { return res.status(500).json({ message: error.message }); }
};

const create = async (req, res) => {
    try {
        const newRequest = await ExpertRequest.create({
            user_id: req.user.id,
            status: 'pending',
            message: req.body.message,
            creation_date: new Date()
        });
        return res.status(201).json(newRequest);
    } catch (error) { return res.status(500).json({ message: error.message }); }
};

const update = async (req, res) => {
    try {
        const { status } = req.body;
        const request = await ExpertRequest.findByPk(req.params.id);

        if (!request) return res.status(404).json({ message: "Request not found" });

        await request.update({ status });
        return res.status(200).json(request);
    } catch (error) { return res.status(500).json({ message: error.message }); }
};

const deleter = async (req, res) => {
    try {
        const request = await ExpertRequest.findByPk(req.params.id);
        if (!request) return res.status(404).json({ message: "Not found" });
        await request.destroy();
        return res.status(200).json({ message: "Deleted successfully" });
    } catch (error) { return res.status(500).json({ message: error.message }); }
};

const getOwn = async (req, res) => {
    try {
        const requests = await ExpertRequest.findAll({
            where: { user_id: req.user.id },
            order: [['creation_date', 'DESC']]
        });

        if (!requests || requests.length === 0) {
            return res.status(404).json({ message: "You haven't submitted any requests yet." });
        }

        return res.status(200).json(requests);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    create,
    deleter,
    update,
    getAll,
    getOwn
};