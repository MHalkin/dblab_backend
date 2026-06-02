const { DataTypes } = require('sequelize');
const db = require('../config/db.config.js');

const DataModel = db.sequelize.define('DataModel', {
    data_model_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    project_id: { type: DataTypes.INTEGER, allowNull: true },
    file: { type: DataTypes.STRING(255), allowNull: true },
    type: { type: DataTypes.STRING(100), allowNull: true },
    upload_date: { type: DataTypes.DATE, allowNull: true }
}, { tableName: 'data_model', timestamps: false });

module.exports = DataModel;