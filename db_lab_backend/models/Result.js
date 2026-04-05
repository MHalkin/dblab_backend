const { DataTypes } = require('sequelize');
const db = require('../config/db.config.js');

const Result = db.sequelize.define('Result', {
    result_Id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    year: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    pages: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    full_name: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    // ОНОВЛЕНО: Поля для премодерації
    status: {
        type: DataTypes.ENUM('В обробці', 'Підтверджено', 'Відхилено'),
        defaultValue: 'В обробці'
    },
    moderation_comment: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    work_Id: { type: DataTypes.INTEGER, allowNull: true },
    result_type_Id: { type: DataTypes.INTEGER, allowNull: true },
    magazine_Id: { type: DataTypes.INTEGER, allowNull: true },
    conference_Id: { type: DataTypes.INTEGER, allowNull: true },
    competition_Id: { type: DataTypes.INTEGER, allowNull: true }
}, {
    tableName: 'result',
    timestamps: false
});

module.exports = Result;