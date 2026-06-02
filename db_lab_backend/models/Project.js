const { DataTypes } = require('sequelize');
const db = require('../config/db.config.js');

const Project = db.sequelize.define('Project', {
    project_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    name: { type: DataTypes.STRING(255), allowNull: false },
    description: { type: DataTypes.STRING(255), allowNull: true },
    creation_date: { type: DataTypes.DATE, allowNull: true },
    status: { type: DataTypes.STRING(100), allowNull: true },
    isexpertise: { type: DataTypes.BOOLEAN, allowNull: false },
    isnormalisation: { type: DataTypes.BOOLEAN, allowNull: false },
    isarchived: { type: DataTypes.BOOLEAN, allowNull: false }
}, { tableName: 'project', timestamps: false });

module.exports = Project;