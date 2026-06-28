const { DataTypes } = require('sequelize');
const db = require('../config/db.config.js');

const Attribute = db.sequelize.define('Attribute', {
    attribute_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    stage_id: { type: DataTypes.INTEGER, allowNull: false },
    name: { type: DataTypes.STRING(255), allowNull: true },
    data_type: { type: DataTypes.STRING(100), allowNull: true }
}, { tableName: 'attribute', timestamps: false });

module.exports = Attribute;