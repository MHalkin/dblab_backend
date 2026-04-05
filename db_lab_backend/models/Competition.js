const { DataTypes } = require('sequelize');
const db = require('../config/db.config.js');

const Competition = db.sequelize.define('Competition', {
    competition_Id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    approximate_date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    host: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    link: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    conference_Id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
}, {
    tableName: 'competition',
    timestamps: false
});

module.exports = Competition;

