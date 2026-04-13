const ResultType = require('../models/Relations').ResultType;

const create = async (req, res) => {
    try {
        const { name } = req.body;
        const resultType = await ResultType.create({ name });
        return res.status(201).json(resultType);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getAll = async (req, res) => {
    getFromDb(req, res);
};

const getFromDb = async (req, res) => {
    try {
        const resultTypes = await ResultType.findAll({});
        return res.status(200).json(resultTypes);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const deleter = async (req, res) => {
    try {
        const { result_type_Id } = req.params;
        const result = await ResultType.destroy({ where: { result_type_Id } });
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const update = async (req, res) => {
    try {
        const { result_type_Id } = req.params;
        const { name } = req.body;
        const resultType = await ResultType.update({ name }, { where: { result_type_Id } });
        return res.status(200).json(resultType);
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

