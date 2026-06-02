const { DataTypes } = require('sequelize');
const db = require('../config/db.config.js');

const Expertise = db.sequelize.define('Expertise', {
    expertise_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    project_id: { type: DataTypes.INTEGER, allowNull: false },
    text: { type: DataTypes.STRING(255), allowNull: true },
    mark: { type: DataTypes.INTEGER, allowNull: true },
    begin_date: { type: DataTypes.DATE, allowNull: true },
    end_date: { type: DataTypes.DATE, allowNull: true }
}, { tableName: 'expertise', timestamps: false });

module.exports = Expertise;