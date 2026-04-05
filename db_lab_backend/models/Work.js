const { DataTypes } = require('sequelize');
const db = require('../config/db.config.js');

const Work = db.sequelize.define('Work', {
    work_Id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    // Статус керує всім процесом
    status: {
        type: DataTypes.ENUM('В обробці', 'Активна', 'Завершена', 'Відхилена'),
        defaultValue: 'В обробці' 
    },
    begining_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    changes_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    // Коментар студента при подачі або викладача при перевірці
    review: { 
        type: DataTypes.STRING(500),
        allowNull: true
    },
    comment: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    file: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    proposal_Id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    user_Id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
}, {
    tableName: 'work',
    timestamps: false
});

module.exports = Work;