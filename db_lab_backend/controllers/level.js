const Level = require('../models/Relations').Level;

const create = async (req, res) => {
    try {
        const { level_name } = req.body;
        const level = await Level.create({ level_name });
        return res.status(201).json(level);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getAll = async (req, res) => {
    getFromDb(req, res);
};

const getFromDb = async (req, res) => {
    try {
        const levels = await Level.findAll({});
        return res.status(200).json(levels);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const deleter = async (req, res) => {
    try {
        const { level_Id } = req.params;
        const result = await Level.destroy({ where: { level_Id } });
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const update = async (req, res) => {
    try {
        const { level_Id } = req.params;
        const { level_name } = req.body;
        const level = await Level.update({ level_name }, { where: { level_Id } });
        return res.status(200).json(level);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = {
    create,
    getAll,
    deleter,
    update,
    getFromDb
};