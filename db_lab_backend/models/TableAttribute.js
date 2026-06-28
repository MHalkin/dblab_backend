const { DataTypes } = require('sequelize');
const db = require('../config/db.config.js');

const TableAttribute = db.sequelize.define('TableAttribute', {
    table_attribute_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    table_id: { type: DataTypes.INTEGER, allowNull: false },
    attribute_id: { type: DataTypes.INTEGER, allowNull: false },
    ispk: { type: DataTypes.BOOLEAN, allowNull: true },
    isfk: { type: DataTypes.BOOLEAN, allowNull: true },
    pseudonim: { type: DataTypes.STRING(255), allowNull: true }
}, { tableName: 'table_attribute', timestamps: false });

module.exports = TableAttribute;