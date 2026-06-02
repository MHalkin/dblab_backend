const { DataTypes } = require('sequelize');
const db = require('../config/db.config.js');

const Dependency = db.sequelize.define('Dependency', {
    dependency_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    table1_id: { type: DataTypes.INTEGER, allowNull: false },
    table2_id: { type: DataTypes.INTEGER, allowNull: false },
    type: { type: DataTypes.STRING(100), allowNull: true },
    colour: { type: DataTypes.STRING(50), allowNull: true },
    cardinal1: { type: DataTypes.STRING(50), allowNull: true },
    cardinal2: { type: DataTypes.STRING(50), allowNull: true }
}, { tableName: 'dependency', timestamps: false });

module.exports = Dependency;