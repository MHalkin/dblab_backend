const { DataTypes } = require('sequelize');
const db = require('../config/db.config.js');

const Conference = db.sequelize.define('Conference', {
    conference_Id: {
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
    city: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    link: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    online: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    offline: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
}, {
    tableName: 'conference',
    timestamps: false
});

module.exports = Conference;

