const { DataTypes } = require('sequelize');
const db = require('../config/db.config.js');

const FunctionalDependency = db.sequelize.define('FunctionalDependency', {
    fd_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    level: { type: DataTypes.STRING(100), allowNull: true },
    colour: { type: DataTypes.STRING(50), allowNull: true }
}, { tableName: 'functional_dependency', timestamps: false });

module.exports = FunctionalDependency;