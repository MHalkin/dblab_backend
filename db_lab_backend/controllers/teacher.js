const path = require('path');
const fs = require('fs').promises;
const fsSync = require('fs');
const Teacher = require('../models/Relations').Teacher;
const User = require('../models/Relations').User;
const sharp = require('sharp');
require('dotenv').config();

const create = async (req, res) => {
    try {
        const { user_Id, full_name, place_of_Employment, position, text, level, teacher_role } = req.body;
        const teacher = await Teacher.create({ user_Id, full_name, place_of_Employment, position, text, level, teacher_role });
        return res.status(201).json(teacher);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getAll = async (req, res) => {
    await getFromDb(req, res);
};

const getFromDb = async (req, res) => {
    try {
        const teachers = await Teacher.findAll({
            include: [{ model: User, attributes: ['login'] }],
        });
        const result = teachers.map(teacher => {
            const { User, ...teacherData } = teacher.toJSON();
            return { ...teacherData, login: User?.login };
        });
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const uploadPhoto = async (req, res) => {
    let newlyCreatedPath = null;
    try {
        const { teacher_Id } = req.params;
        if (!req.file) return res.status(400).json({ message: 'No file uploaded.' });

        const teacher = await Teacher.findByPk(teacher_Id);
        if (!teacher) return res.status(404).json({ message: 'Teacher not found.' });

        const uniqueFilename = `${Date.now()}-${Math.round(Math.random() * 1E9)}.webp`;
        const uploadDir = path.join(__dirname, '../uploads/teacher');
        newlyCreatedPath = path.join(uploadDir, uniqueFilename);

        await fs.mkdir(uploadDir, { recursive: true });

        await sharp(req.file.buffer)
            .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
            .toFormat('webp')
            .toFile(newlyCreatedPath);

        if (teacher.photo) {
            const oldPath = path.join(uploadDir, teacher.photo);
            try { await fs.unlink(oldPath); } catch (e) { }
        }

        await teacher.update({ photo: uniqueFilename });

        return res.status(200).json({ message: 'Photo uploaded successfully.', link: uniqueFilename });
    } catch (error) {
        if (newlyCreatedPath) try { await fs.unlink(newlyCreatedPath); } catch (e) { }
        return res.status(500).json({ message: error.message.includes('unsupported') ? 'Invalid image format.' : error.message });
    }
};

const servePhotoFile = async (req, res) => {
    try {
        const { filename } = req.params;
        const filePath = path.join(__dirname, '../uploads/teacher/', path.basename(filename));

        if (!fsSync.existsSync(filePath)) return res.status(404).json({ message: 'File not found' });
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
            try { await fs.unlink(path.join(__dirname, '../uploads/teacher', filename)); } catch (e) { }
        }

        return res.status(200).json({ message: 'Teacher and file removed' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const update = async (req, res) => {
    try {
        const { teacher_Id } = req.params;
        const updateData = req.body;
        await Teacher.update(updateData, { where: { teacher_Id } });
        return res.status(200).json({ message: 'Teacher updated' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = { create, getAll, deleter, update, getFromDb, servePhotoFile, uploadPhoto };