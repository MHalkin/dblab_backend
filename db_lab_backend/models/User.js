const { DataTypes } = require('sequelize');
const db = require('../config/db.config.js');

const User = db.sequelize.define('User', {
    user_Id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nickname: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    email: {
        type: DataTypes.STRING(255),
        unique: true,
        allowNull: false
    },
    login: {
        type: DataTypes.STRING(255),
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    role: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    student_group: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
}, {
    tableName: 'user',
    timestamps: false
});

module.exports = User;