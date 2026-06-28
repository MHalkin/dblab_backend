const path = require('path');
const Direction = require('../models/Relations').Direction;

const create = async (req, res) => {
    try {
        const { name, description } = req.body;
        const direction = await Direction.create({ name, description });
        return res.status(201).json(direction);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getAll = async (req, res) => {
    getFromDb(req, res);
};

const getFromDb = async (req, res) => {
    try {
        const directions = await Direction.findAll({});
        return res.status(200).json(directions);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const deleter = async (req, res) => {
    try {
        const { direction_Id } = req.params;
        const result = await Direction.destroy({ where: { direction_Id } });
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const update = async (req, res) => {
    try {
        const { direction_Id } = req.params;
        const { name, description } = req.body;
        const direction = await Direction.update({ name, description }, { where: { direction_Id } });
        return res.status(200).json(direction);
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

