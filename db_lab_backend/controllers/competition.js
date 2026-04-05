const path = require('path');
const fs = require('fs');
const cache = path.join(__dirname, '..', 'cache.json');
const Competition = require('../models/Relations').Competition;
const Conference = require('../models/Relations').Conference;

const create = async (req, res) => {
    try {
        const { name, approximate_date, host, link, conference_Id } = req.body;
        const competition = await Competition.create({ name, approximate_date, host, link, conference_Id });
        return res.status(201).json(competition);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getAll = async (req, res) => {
    try {
        const cacheData = JSON.parse(fs.readFileSync(cache, 'utf-8'));
        if (!cacheData.competitions) {
            return res.status(404).json({ message: 'competition not found in cache.' });
        }
        return res.status(200).json(cacheData.competitions);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getFromDb = async (req, res) => {
    try {
        const competitions = await Competition.findAll({
            include: [{
                model: Conference,
                attributes: ['name', 'city'],
                required: false
            }]
        });
        const result = competitions.map(competition => {
            const compData = competition.toJSON();
            const { Conference, ...competitionData } = compData;
            return {
                ...competitionData,
                conference_name: Conference ? Conference.name : null,
            };
        });
        return res.status(200).json(result);
    } catch (error) {
        console.error('Error in getFromDb competition:', error);
        return res.status(500).json({ message: error.message });
    }
};

const deleter = async (req, res) => {
    try {
        const { competition_Id } = req.params;
        const result = await Competition.destroy({ where: { competition_Id } });
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const update = async (req, res) => {
    try {
        const { competition_Id } = req.params;
        const { name, approximate_date, host, link, conference_Id } = req.body;
        const competition = await Competition.update({ name, approximate_date, host, link, conference_Id }, {where: {competition_Id}});
        return res.status(200).json(competition);
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

