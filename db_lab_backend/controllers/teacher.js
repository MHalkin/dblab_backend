const path = require('path');
const fs = require('fs');
const cache = path.join(__dirname, '..', 'cache.json');
const Teacher = require('../models/Relations').Teacher;
const User = require('../models/Relations').User;

const create = async (req, res) => {
    try {
        const { user_Id, full_name, place_of_Employment, position, text, level, teacher_role, photo } = req.body;
        const photoBuffer = photo ? Buffer.from(photo, 'base64') : null;
        const teacher = await Teacher.create({ user_Id, full_name, place_of_Employment, position, text, level, teacher_role, photo: photoBuffer });
        return res.status(201).json(teacher);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getAll = async (req, res) => {
    getFromDb(req, res);
};

const getFromDb = async (req, res) => {
    try {
        const teachers = await Teacher.findAll({
            include: [
                {
                    model: User,
                    attributes: ['login']
                }
            ],
            attributes: { exclude: ['photo'] }
        });
        const result = teachers.map(teacher => {
            const { User, ...teacherData } = teacher.toJSON();
            return {
                ...teacherData,
                login: User.login,
            };
        });
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const deleter = async (req, res) => {
    try {
        const { teacher_Id } = req.params;
        const result = await Teacher.destroy({ where: { teacher_Id } });
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const update = async (req, res) => {
    try {
        const { teacher_Id } = req.params;
        const { user_Id, full_name, place_of_Employment, position, text, level, teacher_role, photo } = req.body;
        const teacher = await Teacher.update({ user_Id, full_name, place_of_Employment, position, text, level, teacher_role, photo }, { where: { teacher_Id } });
        return res.status(200).json(teacher);
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