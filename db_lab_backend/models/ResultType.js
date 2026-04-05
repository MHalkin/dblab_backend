const { DataTypes } = require('sequelize');
const db = require('../config/db.config.js');

const ResultType = db.sequelize.define('ResultType', {
    result_type_Id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
}, {
    tableName: 'result_type',
    timestamps: false
});

module.exports = ResultType;

