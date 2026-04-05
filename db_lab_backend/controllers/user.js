const bcrypt = require('bcryptjs');
const User = require('../models/Relations').User;

const create = async (req, res) => {
    try {
        const { nickname, email, login, password, role, student_group } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ nickname, email, login, password:hashedPassword, role, student_group });
        return res.status(201).json(user);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getAll = async (req, res) => {
    try {
        const users = await User.findAll();
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getFromDb = async (req, res) => {
    // Для таблиці юзерів логіка така ж, як getAll
    return getAll(req, res);
};

const deleter = async (req, res) => {
    try {
        const { user_Id } = req.params;
        const result = await User.destroy({ where: { user_Id } });
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const update = async (req, res) => {
    try {
        const { user_Id } = req.params;
        const { nickname, email, login, password, role, student_group } = req.body;
        
        const updateData = { nickname, email, login, role, student_group };
        
        // Хешуємо пароль тільки якщо він був переданий
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }
        
        const user = await User.update(updateData, {where: {user_Id}});
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = {
    create,
    getAll,
    getFromDb,
    deleter,
    update
};