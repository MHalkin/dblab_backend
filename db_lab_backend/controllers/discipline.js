const Discipline = require('../models/Relations').Discipline;

const create = async (req, res) => {
    try {
        const { discipline_name, discipline_Description, discipline_type, volume, syllabus_link } = req.body;
        const discipline = await Discipline.create({ discipline_name, discipline_Description, discipline_type, volume, syllabus_link });
        return res.status(201).json(discipline);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getAll = async (req, res) => {
    getFromDb(req, res);
};

const getFromDb = async (req, res) => {
    try {
        const disciplines = await Discipline.findAll({});
        return res.status(200).json(disciplines);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const deleter = async (req, res) => {
    try {
        const { discipline_Id } = req.params;
        const result = await Discipline.destroy({ where: { discipline_Id } });
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const { Teacher, Skill } = require('../models/Relations');

const getFull = async (req, res) => {
    try {
        const disciplines = await Discipline.findAll({
            include: [
                {
                    model: Teacher,
                    attributes: ['full_name'],
                    through: { attributes: [] }
                },
                {
                    model: Skill,
                    attributes: ['skill_name'],
                    through: { attributes: [] }
                }
            ]
        });

        const result = disciplines.map(d => {
            const data = d.toJSON();

            return {
                ...data,
                teachers: (data.Teachers || []).map(t => t.full_name).join(', '),
                skills: (data.Skills || []).map(s => s.skill_name).join(', ')
            };
        });

        return res.status(200).json(result);

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const update = async (req, res) => {
    try {
        const { discipline_Id } = req.params;
        const { discipline_name, discipline_Description, discipline_type, volume, syllabus_link } = req.body;
        const discipline = await Discipline.update({ discipline_name, discipline_Description, discipline_type, volume, syllabus_link }, { where: { discipline_Id } });
        return res.status(200).json(discipline);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const getFullId = async (req, res) => {
    try {
        const { discipline_Id } = req.params;

        const discipline = await Discipline.findOne({
            where: { discipline_Id },
            include: [
                {
                    model: Teacher,
                    attributes: ['full_name', 'position', 'text', 'photo'],
                    through: { attributes: [] }
                },
                {
                    model: Skill,
                    attributes: ['skill_name'],
                    through: { attributes: [] }
                }
            ]
        });

        if (!discipline) {
            return res.status(404).json({ message: 'Discipline not found' });
        }

        const data = discipline.toJSON();

        return res.status(200).json({
            ...data,
            teachers: data.Teachers || [],
            skills: (data.Skills || []).map(s => s.skill_name)
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    create,
    getAll,
    deleter,
    getFull,
    update,
    getFullId,
    getFromDb
};