const { DataTypes } = require('sequelize');
const db = require('../config/db.config.js');

const TableDb = db.sequelize.define('TableDb', {
    table_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    stage_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    name: { type: DataTypes.STRING(255), allowNull: true },
    colour: { type: DataTypes.STRING(50), allowNull: true }
}, { tableName: 'table', timestamps: false });

module.exports = TableDb;