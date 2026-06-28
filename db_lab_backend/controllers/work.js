const path = require('path');
const fs = require('fs');
const { Work, Proposal, User, Result } = require('../models/Relations');

const create = async (req, res) => {
    try {
        const { name, review, comment, file, proposal_Id, user_Id, status, begining_date } = req.body;

        const work = await Work.create({
            name: name || "Нова робота",
            review,
            comment,
            begining_date: begining_date || new Date(),
            changes_date: new Date(),
            file,
            proposal_Id,
            user_Id,
            status: status || 'Активна'
        });

        if (proposal_Id) {
            await Proposal.update({ status: 'Є записи' }, { where: { proposal_Id } });
        }

        return res.status(201).json(work);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const studentCreate = async (req, res) => {
    try {
        const { name, review, comment, file, proposal_Id } = req.body;
        const authUserId = req.user.id;

        const existingWork = await Work.findOne({
            where: { user_Id: authUserId, proposal_Id, status: ['В обробці', 'Активна'] }
        });

        if (existingWork) {
            return res.status(400).json({ message: "Ви вже подали заявку на цю тему." });
        }

        const work = await Work.create({
            name: name || "Заявка на тему",
            review: "Очікує розгляду",
            comment: comment || "Заявка через сайт",
            begining_date: new Date(),
            changes_date: new Date(),
            file: "",
            proposal_Id,
            user_Id: authUserId,
            status: 'В обробці'
        });

        if (proposal_Id) {
            await Proposal.update({ status: 'Є записи' }, { where: { proposal_Id } });
        }

        return res.status(201).json(work);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const updateStatus = async (req, res) => {
    try {
        const { work_Id } = req.params;
        const { status, review } = req.body;

        const work = await Work.findByPk(work_Id);
        if (!work) return res.status(404).json({ message: "Роботу не знайдено" });

        await work.update({
            status,
            review, // Коментар викладача
            changes_date: new Date()
        });

        return res.status(200).json(work);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getMyWorks = async (req, res) => {
    try {
        const userId = req.user.id;

        const works = await Work.findAll({
            where: { user_Id: userId },
            include: [{
                model: Proposal,
                attributes: ['name']
            }]
        });

        return res.status(200).json(works);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getAll = async (req, res) => {
    try {
        const works = await Work.findAll({});
        return res.status(200).json(works);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getFromDb = async (req, res) => {
    try {
        const works = await Work.findAll({
            include: [
                {
                    model: Proposal,
                    attributes: ['name', 'status']
                },
                {
                    model: User,
                    attributes: ['nickname', 'email']
                }
            ]
        });
        return res.status(200).json(works);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const deleter = async (req, res) => {
    try {
        const { work_Id } = req.params;
        const result = await Work.destroy({ where: { work_Id } });
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const studentDelete = async (req, res) => {
    try {
        const { work_Id } = req.params;
        const authUserId = req.user.id;

        const work = await Work.findOne({
            where: {
                work_Id,
                user_Id: authUserId,
                status: ['В обробці', 'Відхилена']
            }
        });

        if (!work) {
            return res.status(404).json({ message: "Заявку не знайдено або у вас немає прав на її видалення." });
        }

        await Result.destroy({ where: { work_Id } });
        await work.destroy();

        return res.status(200).json({ message: "Заявку успішно видалено." });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const update = async (req, res) => {
    try {
        const { work_Id } = req.params;
        const { status, begining_date, review, comment, name, file, proposal_Id, user_Id } = req.body;

        const updateData = {
            status,
            begining_date,
            review,
            comment,
            name,
            file,
            proposal_Id,
            user_Id,
            changes_date: new Date()
        };

        Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

        const work = await Work.update(updateData, { where: { work_Id } });
        return res.status(200).json(work);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = {
    create,
    studentCreate,
    updateStatus,
    getMyWorks,
    getAll,
    deleter,
    studentDelete,
    update,
    getFromDb
};