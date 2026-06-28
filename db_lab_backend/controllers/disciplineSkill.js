const DisciplineSkill = require('../models/Relations').DisciplineSkill;
const Discipline = require('../models/Relations').Discipline;
const Skill = require('../models/Relations').Skill;
const Level = require('../models/Relations').Level;

const create = async (req, res) => {
    try {
        const { discipline_Id, skill_Id, level_Id, learning_type } = req.body;
        const disciplineSkill = await DisciplineSkill.create({ discipline_Id, skill_Id, level_Id, learning_type });
        return res.status(201).json(disciplineSkill);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getAll = async (req, res) => {
    getFromDb(req, res);
};

const getFromDb = async (req, res) => {
    try {
        const disciplineSkills = await DisciplineSkill.findAll({
            include: [
                {
                    model: Level,
                    attributes: ['level_name'],
                    required: false
                },
                {
                    model: Discipline,
                    attributes: ['discipline_name']
                },
                {
                    model: Skill,
                    attributes: ['skill_name']
                },
            ]
        });
        const result = disciplineSkills.map(disciplineSkill => {
            const { Level, Discipline, Skill, ...disciplineSkillDate } = disciplineSkill.toJSON();
            return {
                ...disciplineSkillDate,
                level_name: Level ? Level.level_name : null,
                discipline_name: Discipline.discipline_name,
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
        const { disciplineSkill_Id } = req.params;
        const result = await DisciplineSkill.destroy({ where: { disciplineSkill_Id } });
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const update = async (req, res) => {
    try {
        const { disciplineSkill_Id } = req.params;
        const { discipline_Id, skill_Id, level_Id, learning_type } = req.body;
        const disciplineSkill = await DisciplineSkill.update({ discipline_Id, skill_Id, level_Id, learning_type }, { where: { disciplineSkill_Id } });
        return res.status(200).json(disciplineSkill);
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