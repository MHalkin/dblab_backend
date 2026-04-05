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
        type: DataTypes.STRING(500),
        allowNull: true
    },
    status: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    complexity: {
        type: DataTypes.STRING(100),
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

