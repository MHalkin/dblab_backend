const { DataTypes } = require('sequelize');
const db = require('../config/db.config.js');

const ExpertRequest = db.sequelize.define('ExpertRequest', {
    request_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    status: { type: DataTypes.STRING(100), allowNull: true },
    message: { type: DataTypes.STRING(255), allowNull: true },
    creation_date: { type: DataTypes.DATE, allowNull: true }
}, { tableName: 'expert_request', timestamps: false });

module.exports = ExpertRequest;