const { DataTypes } = require('sequelize');
const db = require('../config/db.config.js');

const Imbed = db.sequelize.define('Imbed', {
    imbed_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    expertise_id: { type: DataTypes.INTEGER, allowNull: true },
    link: { type: DataTypes.STRING(255), allowNull: true }
}, { tableName: 'imbed', timestamps: false });

module.exports = Imbed;