const path = require('path');
const fs = require('fs');
const cache = path.join(__dirname, '..', 'cache.json');
const SkillChapter = require('../models/Relations').SkillChapter;
const Skill = require('../models/Relations').Skill;
const Chapter = require('../models/Relations').Chapter;

const create = async (req, res) => {
    try {
        const { skill_Id, chapter_Id } = req.body;
        const skillChapter = await SkillChapter.create({ skill_Id, chapter_Id });
        return res.status(201).json(skillChapter);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getAll = async (req, res) => {
    getFromDb(req, res);
};

const getFromDb = async (req, res) => {
    try {
        const skillChapters = await SkillChapter.findAll({
            include: [
                {
                    model: Chapter,
                    attributes: ['chapter_name']
                },
                {
                    model: Skill,
                    attributes: ['skill_name']
                },
            ]
        });
        const result = skillChapters.map(skillChapter => {
            const { Chapter, Skill, ...skillChapterData } = skillChapter.toJSON();
            return {
                ...skillChapterData,
                chapter_name: Chapter.chapter_name,
                skill_name: Skill.skill_name,
            };
        });
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const deleter = async (req, res) => {
    try {
        const { chapter_Id } = req.body;
        const skillChapters = await SkillChapter.findAll({ where: { chapter_Id } });
        if (!skillChapters.length) {
            return res.status(404).json({ message: 'No SkillChapters found for the given chapter_Id' });
        }
        const result = await SkillChapter.destroy({ where: { chapter_Id } });
        return res.status(200).json({ deletedCount: result });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const update = async (req, res) => {
    try {
        const { skillChapter_Id } = req.params;
        const { skill_Id, chapter_Id } = req.body;
        const skillChapter = await SkillChapter.update({ skill_Id, chapter_Id }, { where: { skillChapter_Id } });
        return res.status(200).json(skillChapter);
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