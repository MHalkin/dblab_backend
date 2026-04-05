const path = require('path');
const fs = require('fs');
const cache = path.join(__dirname, '..', 'cache.json');
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
    try {
        let cacheData = {};
        if (fs.existsSync(cache)) {
            try {
                const fileContent = fs.readFileSync(cache, 'utf-8');
                if (fileContent) cacheData = JSON.parse(fileContent);
            } catch (err) { console.error(err); }
        }

        if (cacheData.resultTypes && cacheData.resultTypes.length > 0) {
            return res.status(200).json(cacheData.resultTypes);
        }

        const resultTypes = await ResultType.findAll({});
        cacheData.resultTypes = resultTypes;
        fs.writeFileSync(cache, JSON.stringify(cacheData, null, 2));

        return res.status(200).json(resultTypes);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
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
        const resultType = await ResultType.update({ name }, {where: {result_type_Id}});
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

