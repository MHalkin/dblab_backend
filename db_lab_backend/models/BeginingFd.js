const { DataTypes } = require('sequelize');
const db = require('../config/db.config.js');

const BeginingFd = db.sequelize.define('BeginingFd', {
    begining_fd_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    attribute_id: { type: DataTypes.INTEGER, allowNull: false },
    functional_dependency_id: { type: DataTypes.INTEGER, allowNull: false }
}, { tableName: 'begining_fd', timestamps: false });

module.exports = BeginingFd;