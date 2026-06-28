const path = require('path');
const DevelopmentDirection = require('../models/Relations').DevelopmentDirection;

const create = async (req, res) => {
    try {
        const { development_direction_name, development_direction_Description } = req.body;
        const developmentDirection = await DevelopmentDirection.create({ development_direction_name, development_direction_Description });
        return res.status(201).json(developmentDirection);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getAll = async (req, res) => {
    getFromDb(req, res);
};

const getFromDb = async (req, res) => {
    try {
        const developmentDirections = await DevelopmentDirection.findAll({});
        return res.status(200).json(developmentDirections);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const deleter = async (req, res) => {
    try {
        const { development_direction_Id } = req.params;
        const result = await DevelopmentDirection.destroy({ where: { development_direction_Id } });
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const update = async (req, res) => {
    try {
        const { development_direction_Id } = req.params;
        const { development_direction_name, development_direction_Description } = req.body;
        const developmentDirection = await DevelopmentDirection.update({ development_direction_name, development_direction_Description }, { where: { development_direction_Id } });
        return res.status(200).json(developmentDirection);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const getRoad = async (req, res) => {
    try {
        const { development_direction_Id } = req.params;

        const direction = await DevelopmentDirection.findOne({
            where: { development_direction_Id },
            include: [
                {
                    model: require('../models/Relations').Chapter,
                    include: [
                        {
                            model: require('../models/Relations').Level,
                            attributes: ['level_Id', 'level_name']
                        },
                        {
                            model: require('../models/Relations').Skill,
                            through: { attributes: [] },
                            attributes: ['skill_Id', 'skill_name']
                        }
                    ]
                }
            ]
        });

        if (!direction) {
            return res.status(404).json({ message: 'Discipline not found' });
        }

        const chapters = direction.Chapters || [];

        const levelMap = {};

        chapters.forEach(ch => {
            const level = ch.Level;
            if (!level) return;

            if (!levelMap[level.level_Id]) {
                levelMap[level.level_Id] = {
                    name: level.level_name,
                    sections: []
                };
            }

            levelMap[level.level_Id].sections.push({
                name: ch.chapter_name,
                skills: (ch.Skills || []).map(s => ({
                    name: s.skill_name
                }))
            });
        });

        const roadmap = {
            direction,
            levels: Object.values(levelMap)
        };

        return res.status(200).json(roadmap);

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


module.exports = {
    create,
    getAll,
    deleter,
    update,
    getRoad,
    getFromDb
};