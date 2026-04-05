const { DataTypes } = require('sequelize');
const db = require('../config/db.config.js');

const Direction = db.sequelize.define('Direction', {
    direction_Id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    description: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
}, {
    tableName: 'direction',
    timestamps: false
});

module.exports = Direction;

