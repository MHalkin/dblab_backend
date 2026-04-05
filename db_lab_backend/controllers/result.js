const path = require('path');
const fs = require('fs');
const cache = path.join(__dirname, '..', 'cache.json');
const { Result, Work } = require('../models/Relations');

const create = async (req, res) => {
    try {
        const { name, year, pages, full_name, work_Id, result_type_Id, magazine_Id, conference_Id, competition_Id } = req.body;
        const result = await Result.create({ name, year, pages, full_name, work_Id, result_type_Id, magazine_Id, conference_Id, competition_Id });
        return res.status(201).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const studentCreate = async (req, res) => {
    try {
        const { name, year, pages, full_name, work_Id, result_type_Id, magazine_Id, conference_Id, competition_Id } = req.body;

        const result = await Result.create({
            name,
            year,
            pages,
            full_name,
            work_Id,
            result_type_Id,
            magazine_Id,
            conference_Id,
            competition_Id,
            status: 'В обробці' // Дефолтний статус
        });

        return res.status(201).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getMyResults = async (req, res) => {
    try {
        const { work_Id } = req.params;
        const results = await Result.findAll({
            where: { work_Id }
        });
        return res.status(200).json(results);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const updateStatus = async (req, res) => {
    try {
        const { result_Id } = req.params;
        const { status, moderation_comment } = req.body;

        await Result.update(
            { status, moderation_comment },
            { where: { result_Id } }
        );

        return res.status(200).json({ message: "Статус оновлено" });
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

        if (cacheData.results && cacheData.results.length > 0) {
            return res.status(200).json(cacheData.results);
        }

        const results = await Result.findAll({});
        
        cacheData.results = results;
        fs.writeFileSync(cache, JSON.stringify(cacheData, null, 2));

        return res.status(200).json(results);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getFromDb = async (req, res) => {
    try {
        const results = await Result.findAll({
            include: [
                {
                    model: require('../models/Relations').Work,
                    attributes: ['name'],
                    include: [{
                        model: require('../models/Relations').Proposal,
                        attributes: ['name']
                    }]
                },
                {
                    model: require('../models/Relations').ResultType,
                    attributes: ['name']
                },
                {
                    model: require('../models/Relations').Magazine,
                    attributes: ['name', 'publisher'],
                    required: false
                },
                {
                    model: require('../models/Relations').Conference,
                    attributes: ['name', 'city'],
                    required: false
                },
                {
                    model: require('../models/Relations').Competition,
                    attributes: ['name'],
                    required: false
                }
            ]
        });
        const result = results.map(item => {
            const itemData = item.toJSON();
            const { Work, ResultType, Magazine, Conference, Competition, ...resultData } = itemData;
            return {
                ...resultData,
                work_name: Work ? Work.name : null,
                result_type_name: ResultType ? ResultType.name : null,
                magazine_name: Magazine ? Magazine.name : null,
                conference_name: Conference ? Conference.name : null,
                competition_name: Competition ? Competition.name : null,
            };
        });
        return res.status(200).json(result);
    } catch (error) {
        console.error('Error in getFromDb result:', error);
        return res.status(500).json({ message: error.message });
    }
};

const deleter = async (req, res) => {
    try {
        const { result_Id } = req.params;
        const result = await Result.destroy({ where: { result_Id } });
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const update = async (req, res) => {
    try {
        const { result_Id } = req.params;
        const { status, moderation_comment, name, year, pages, full_name, work_Id, result_type_Id, magazine_Id, conference_Id, competition_Id } = req.body;
        
        const updateData = { 
            status,
            moderation_comment,
            name, year, pages, full_name, work_Id, result_type_Id, magazine_Id, conference_Id, competition_Id 
        };

        Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

        const result = await Result.update(updateData, { where: { result_Id } });
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = {
    create,
    studentCreate,
    getMyResults,
    updateStatus,
    getAll,
    deleter,
    update,
    getFromDb
};