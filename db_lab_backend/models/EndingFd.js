const { DataTypes } = require('sequelize');
const db = require('../config/db.config.js');

const EndingFd = db.sequelize.define('EndingFd', {
    ending_fd_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    attribute_id: { type: DataTypes.INTEGER, allowNull: false },
    functional_dependency_id: { type: DataTypes.INTEGER, allowNull: false }
}, { tableName: 'ending_fd', timestamps: false });

module.exports = EndingFd;