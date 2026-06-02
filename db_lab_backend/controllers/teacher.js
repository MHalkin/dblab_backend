const path = require('path');
const fs = require('fs');
const cache = path.join(__dirname, '..', 'cache.json');
const Teacher = require('../models/Relations').Teacher;
const User = require('../models/Relations').User;
require('dotenv').config();

const create = async (req, res) => {
    try {
        const { user_Id, full_name, place_of_Employment, position, text, level, teacher_role } = req.body;
        const teacher = await Teacher.create({ user_Id, full_name, place_of_Employment, position, text, level, teacher_role, photo });
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

const uploadPhoto = async (req, res) => {
    try {
        const { teacher_Id } = req.params;

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded.' });
        }

        const teacher = await Teacher.findByPk(teacher_Id);
        if (!teacher) {
            if (fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(404).json({ message: 'Teacher not found. File deleted.' });
        }

        if (teacher.photo) {
            const oldPath = path.join(__dirname, '../uploads', teacher.photo);
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
        }

        await teacher.update({ photo: req.file.filename });

        return res.status(200).json({
            message: 'Photo uploaded and link saved',
            link: req.file.filename
        });
    } catch (error) {
        if (fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        return res.status(500).json({ message: error.message });
    }
};

const servePhotoFile = async (req, res) => {
    try {
        const { filename } = req.params;
        const safeFilename = path.basename(filename);
        const filePath = path.join(__dirname, '../uploads', safeFilename);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'File not found' });
        }

        return res.sendFile(filePath);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const deleter = async (req, res) => {
    try {
        const { teacher_Id } = req.params;
        const teacher = await Teacher.findByPk(teacher_Id);
        if (!teacher) return res.status(404).json({ message: "Teacher not found" });

        const filename = teacher.photo;

        await Teacher.destroy({ where: { teacher_Id } });

        if (filename) {
            const filePath = path.join(__dirname, '../uploads', filename);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        return res.status(200).json({ message: 'Teacher and file removed' });
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
    getFromDb,
    servePhotoFile,
    uploadPhoto
};