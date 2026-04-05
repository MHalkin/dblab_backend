const path = require('path');
const fs = require('fs');
const cache = path.join(__dirname, '..', 'cache.json');
const Proposal = require('../models/Relations').Proposal;

const create = async (req, res) => {
    try {
        const { name, description, status, complexity, teacher_Id, proposal_type_Id, direction_Id } = req.body;
        const proposal = await Proposal.create({ name, description, status, complexity, teacher_Id, proposal_type_Id, direction_Id });
        return res.status(201).json(proposal);
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

        if (cacheData.proposals && cacheData.proposals.length > 0) {
            return res.status(200).json(cacheData.proposals);
        }

        const proposals = await Proposal.findAll({});
        cacheData.proposals = proposals;
        fs.writeFileSync(cache, JSON.stringify(cacheData, null, 2));

        return res.status(200).json(proposals);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getFromDb = async (req, res) => {
    try {
        const proposals = await Proposal.findAll({
            include: [
                {
                    model: require('../models/Relations').Teacher,
                    attributes: ['full_name']
                },
                {
                    model: require('../models/Relations').ProposalType,
                    attributes: ['name']
                },
                {
                    model: require('../models/Relations').Direction,
                    attributes: ['name']
                }
            ]
        });
        return res.status(200).json(proposals);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const deleter = async (req, res) => {
    try {
        const { proposal_Id } = req.params;
        const result = await Proposal.destroy({ where: { proposal_Id } });
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const update = async (req, res) => {
    try {
        const { proposal_Id } = req.params;
        const { name, description, status, complexity, teacher_Id, proposal_type_Id, direction_Id } = req.body;
        const proposal = await Proposal.update({ name, description, status, complexity, teacher_Id, proposal_type_Id, direction_Id }, {where: {proposal_Id}});
        return res.status(200).json(proposal);
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

