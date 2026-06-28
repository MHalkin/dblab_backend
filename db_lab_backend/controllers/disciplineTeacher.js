const path = require('path');
const fs = require('fs');
const cache = path.join(__dirname, '..', 'cache.json');
const DisciplineTeacher = require('../models/Relations').DisciplineTeacher;
const Discipline = require('../models/Relations').Discipline;
const Teacher = require('../models/Relations').Teacher;
const Language = require('../models/Relations').Language;

const create = async (req, res) => {
    try {
        const { teacher_Id, discipline_Id, language_Id, beginning_Year } = req.body;
        const disciplineTeacher = await DisciplineTeacher.create({ teacher_Id, discipline_Id, language_Id, beginning_Year });
        return res.status(201).json(disciplineTeacher);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getAll = async (req, res) => {
    getFromDb(req, res);
};

const getFromDb = async (req, res) => {
    try {
        const disciplineTeachers = await DisciplineTeacher.findAll({
            include: [
                {
                    model: Language,
                    attributes: ['language_name']
                },
                {
                    model: Discipline,
                    attributes: ['discipline_name']
                },
                {
                    model: Teacher,
                    attributes: ['full_name']
                },
            ]
        });
        const result = disciplineTeachers.map(disciplineTeacher => {
            const { Language, Discipline, Teacher, ...disciplineTeacherDate } = disciplineTeacher.toJSON();
            return {
                ...disciplineTeacherDate,
                language_name: Language.language_name,
                discipline_name: Discipline.discipline_name,
                full_name: Teacher.full_name,
            };
        });
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const deleter = async (req, res) => {
    try {
        const { disciplineTeacher_Id } = req.params;
        const result = await DisciplineTeacher.destroy({ where: { disciplineTeacher_Id } });
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const update = async (req, res) => {
    try {
        const { disciplineTeacher_Id } = req.params;
        const { teacher_Id, discipline_Id, language_Id, beginning_Year } = req.body;
        const disciplineTeacher = await DisciplineTeacher.update({ teacher_Id, discipline_Id, language_Id, beginning_Year }, { where: { disciplineTeacher_Id } });
        return res.status(200).json(disciplineTeacher);
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