const { DataTypes } = require('sequelize');
const db = require('../config/db.config.js');

const Magazine = db.sequelize.define('Magazine', {
    magazine_Id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    publisher: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    city: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    release_frequency: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    link: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
}, {
    tableName: 'magazine',
    timestamps: false
});

module.exports = Magazine;

