const path = require('path');
const fs = require('fs');
const cache = path.join(__dirname, '..', 'cache.json');
const Conference = require('../models/Relations').Conference;

const create = async (req, res) => {
    try {
        const { name, approximate_date, host, city, link, online, offline } = req.body;
        const conferenceData = {
            name,
            approximate_date,
            host,
            city,
            link,
            online: online === "true" || online === true,
            offline: offline === "true" || offline === true
        };
        const conference = await Conference.create(conferenceData);
        return res.status(201).json(conference);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getAll = async (req, res) => {
    try {
        const cacheData = JSON.parse(fs.readFileSync(cache, 'utf-8'));
        if (!cacheData.conferences) {
            return res.status(404).json({ message: 'conference not found in cache.' });
        }
        return res.status(200).json(cacheData.conferences);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getFromDb = async (req, res) => {
    try {
        const conferences = await Conference.findAll({});
        const result = conferences.map(conference => {
            const data = conference.toJSON();
            return {
                ...data,
                online: data.online === true || data.online === 1 ? "true" : "false",
                offline: data.offline === true || data.offline === 1 ? "true" : "false"
            };
        });
        return res.status(200).json(result);
    } catch (error) {
        console.error('Error in getFromDb conference:', error);
        return res.status(500).json({ message: error.message });
    }
};

const deleter = async (req, res) => {
    try {
        const { conference_Id } = req.params;
        const result = await Conference.destroy({ where: { conference_Id } });
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const update = async (req, res) => {
    try {
        const { conference_Id } = req.params;
        const { name, approximate_date, host, city, link, online, offline } = req.body;
        const conferenceData = {
            name,
            approximate_date,
            host,
            city,
            link,
            online: online === "true" || online === true,
            offline: offline === "true" || offline === true
        };
        const conference = await Conference.update(conferenceData, {where: {conference_Id}});
        return res.status(200).json(conference);
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

