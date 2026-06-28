const { DataTypes } = require('sequelize');
const db = require('../config/db.config.js');

const FdStage = db.sequelize.define('FdStage', {
    fd_stage_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    stage_id: { type: DataTypes.INTEGER, allowNull: false },
    functional_dependency_id: { type: DataTypes.INTEGER, allowNull: false },
    type: { type: DataTypes.STRING(100), allowNull: true }
}, { tableName: 'fd_stage', timestamps: false });

module.exports = FdStage;