const { DataTypes } = require('sequelize');
const db = require('../config/db.config.js');

const Proposal = db.sequelize.define('Proposal', {
    proposal_Id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    description: {
        type: DataTypes.STRING(2000),
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM(
            'Запропоновано',
            'Підтверджено',
            'Відкладено',
            'Завершено',
            'Є записи'
        ),
        allowNull: true,
        defaultValue: 'Запропоновано'
    },
    complexity: {
        type: DataTypes.ENUM(
            'Низька',
            'Середня',
            'Висока'
        ),
        allowNull: true
    },
    teacher_Id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    proposal_type_Id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    direction_Id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
}, {
    tableName: 'proposal',
    timestamps: false
});

module.exports = Proposal;

