const Chapter = require('../models/Relations').Chapter;
const Skill = require('../models/Relations').Skill;
const Level = require('../models/Relations').Level;
const DevelopmentDirection = require('../models/DevelopmentDirection');

const create = async (req, res) => {
    try {
        const { level_Id, development_direction_Id, chapter_name } = req.body;
        const chapter = await Chapter.create({ level_Id, development_direction_Id, chapter_name });
        return res.status(201).json(chapter);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getAll = async (req, res) => {
    try {
        const chapters = await Chapter.findAll();

        if (!chapters || chapters.length === 0) {
            return res.status(404).json({ message: 'Chapters not found.' });
        }

        return res.status(200).json(chapters);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getFromDb = async (req, res) => {
    try {
        const chapters = await Chapter.findAll({
            include: [
                {
                    model: Level,
                    attributes: ['level_Id', 'level_name']
                },
                {
                    model: DevelopmentDirection,
                    attributes: ['development_direction_Id', 'development_direction_name']
                },
                {
                    model: Skill,
                    through: { attributes: [] },
                    attributes: ['skill_Id', 'skill_name']
                }
            ]
        });
        const result = chapters.map(chapter => {
            const chapterJSON = chapter.toJSON();

            return {
                chapter_Id: chapterJSON.chapter_Id,
                chapter_name: chapterJSON.chapter_name,

                level_Id: chapterJSON.Level?.level_Id || null,
                level_name: chapterJSON.Level?.level_name || null,

                development_direction_Id: chapterJSON.DevelopmentDirection?.development_direction_Id || null,
                development_direction_name: chapterJSON.DevelopmentDirection?.development_direction_name || null,

                skill_Id: chapterJSON.Skills?.map(skill => skill.skill_Id) || [],
                skill_names: chapterJSON.Skills?.map(skill => skill.skill_name) || []
            };
        });

        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const deleter = async (req, res) => {
    try {
        const { chapter_Id } = req.params;
        const result = await Chapter.destroy({ where: { chapter_Id } });
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const update = async (req, res) => {
    try {
        const { chapter_Id } = req.params;
        const { level_Id, development_direction_Id, chapter_name } = req.body;
        const chapter = await Chapter.update({ level_Id, development_direction_Id, chapter_name }, { where: { chapter_Id } });
        return res.status(200).json(chapter);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const getFullFromDb = async (req, res) => {
    try {
        const chapters = await Chapter.findAll({
            include: [
                {
                    model: Skill,
                    through: { attributes: [] }
                }
            ]
        });
        const result = chapters.map(chapter => {
            const { Skills, ...chapterData } = chapter.toJSON();
            return {
                ...chapterData,
                skills: Skills
            };
        });
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    create,
    getAll,
    deleter,
    update,
    getFullFromDb,
    getFromDb
};