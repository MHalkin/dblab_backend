const { DataTypes } = require('sequelize');
const db = require('../config/db.config.js');

const ProjectComment = db.sequelize.define('ProjectComment', {
    comment_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    project_id: { type: DataTypes.INTEGER, allowNull: true },
    previous_comment_id: { type: DataTypes.INTEGER, allowNull: true },
    expertise_id: { type: DataTypes.INTEGER, allowNull: true },
    text: { type: DataTypes.STRING(255), allowNull: true },
    date: { type: DataTypes.DATE, allowNull: true },
    mark: { type: DataTypes.INTEGER, allowNull: true }
}, { tableName: 'project_comment', timestamps: false });

module.exports = ProjectComment;