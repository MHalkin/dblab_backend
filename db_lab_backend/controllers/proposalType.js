const path = require('path');
const fs = require('fs');
const cache = path.join(__dirname, '..', 'cache.json');
const ProposalType = require('../models/Relations').ProposalType;

const create = async (req, res) => {
    try {
        const { name } = req.body;
        const proposalType = await ProposalType.create({ name });
        return res.status(201).json(proposalType);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getAll = async (req, res) => {
    try {
        let cacheData = {};
        if (fs.existsSync(cache)) {
            try {
                const fileContent = fs.readFileSync(cache, 'utf-8');
                if (fileContent) cacheData = JSON.parse(fileContent);
            } catch (err) { console.error(err); }
        }

        if (cacheData.proposalTypes && cacheData.proposalTypes.length > 0) {
            return res.status(200).json(cacheData.proposalTypes);
        }

        const proposalTypes = await ProposalType.findAll({});
        cacheData.proposalTypes = proposalTypes;
        fs.writeFileSync(cache, JSON.stringify(cacheData, null, 2));

        return res.status(200).json(proposalTypes);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getFromDb = async (req, res) => {
    try {
        const proposalTypes = await ProposalType.findAll({});
        return res.status(200).json(proposalTypes);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const deleter = async (req, res) => {
    try {
        const { proposal_type_Id } = req.params;
        const result = await ProposalType.destroy({ where: { proposal_type_Id } });
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const update = async (req, res) => {
    try {
        const { proposal_type_Id } = req.params;
        const { name } = req.body;
        const proposalType = await ProposalType.update({ name }, {where: {proposal_type_Id}});
        return res.status(200).json(proposalType);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = {
    create,
    getAll,
    deleter,
    update,
    getFromDb
};

