const { DataTypes } = require('sequelize');
const db = require('../config/db.config.js');

const ProposalType = db.sequelize.define('ProposalType', {
    proposal_type_Id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
}, {
    tableName: 'proposal_type',
    timestamps: false
});

module.exports = ProposalType;

