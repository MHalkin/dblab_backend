const path = require('path');
const fs = require('fs');
const cache = path.join(__dirname, '..', 'cache.json');
const Magazine = require('../models/Relations').Magazine;

const create = async (req, res) => {
    try {
        const { name, publisher, city, release_frequency, link } = req.body;
        const magazine = await Magazine.create({ name, publisher, city, release_frequency, link });
        return res.status(201).json(magazine);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getAll = async (req, res) => {
    try {
        const cacheData = JSON.parse(fs.readFileSync(cache, 'utf-8'));
        if (!cacheData.magazines) {
            return res.status(404).json({ message: 'magazine not found in cache.' });
        }
        return res.status(200).json(cacheData.magazines);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getFromDb = async (req, res) => {
    try {
        const magazines = await Magazine.findAll({});
        return res.status(200).json(magazines);
    } catch (error) {
        console.error('Error in getFromDb magazine:', error);
        return res.status(500).json({ message: error.message });
    }
};

const deleter = async (req, res) => {
    try {
        const { magazine_Id } = req.params;
        const result = await Magazine.destroy({ where: { magazine_Id } });
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const update = async (req, res) => {
    try {
        const { magazine_Id } = req.params;
        const { name, publisher, city, release_frequency, link } = req.body;
        const magazine = await Magazine.update({ name, publisher, city, release_frequency, link }, {where: {magazine_Id}});
        return res.status(200).json(magazine);
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

