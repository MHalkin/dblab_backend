const { DataTypes } = require('sequelize');
const db = require('../config/db.config.js');

const Stage = db.sequelize.define('Stage', {
    stage_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    project_id: { type: DataTypes.INTEGER, allowNull: false },
    form: { type: DataTypes.STRING(255), allowNull: true }
}, { tableName: 'stage', timestamps: false });

module.exports = Stage;