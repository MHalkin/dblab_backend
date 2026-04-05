const path = require('path');
const fs = require('fs');
const cache = path.join(__dirname, '..', 'cache.json');
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
    try {
        let cacheData = {};
        if (fs.existsSync(cache)) {
            try {
                const fileContent = fs.readFileSync(cache, 'utf-8');
                if (fileContent) {
                    cacheData = JSON.parse(fileContent);
                }
            } catch (err) {
                console.error("Error reading cache file:", err);
            }
        }

        if (cacheData.directions && cacheData.directions.length > 0) {
            console.log('Serving from Cache');
            return res.status(200).json(cacheData.directions);
        }

        console.log('Serving from Database');
        const directions = await Direction.findAll({});

        cacheData.directions = directions;
        fs.writeFileSync(cache, JSON.stringify(cacheData, null, 2));

        return res.status(200).json(directions);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
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
        const direction = await Direction.update({ name, description }, {where: {direction_Id}});
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

