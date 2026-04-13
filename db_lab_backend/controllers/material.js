const Material = require('../models/Relations').Material;
const Event = require('../models/Relations').Event;

const create = async (req, res) => {
    try {
        const { event_Id, material_name, file, material_type } = req.body;
        const material = await Material.create({ event_Id, material_name, file, material_type });
        return res.status(201).json(material);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getAll = async (req, res) => {
    try {
        const materials = await Material.findAll();

        if (!materials || materials.length === 0) {
            return res.status(404).json({ message: 'material not found.' });
        }

        return res.status(200).json(materials);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getFromDb = async (req, res) => {
    try {
        const materials = await Material.findAll({
            include: [
                {
                    model: Event,
                    attributes: ['event_name']
                },
            ]
        });
        const result = materials.map(material => {
            const { Event, ...materialData } = material.toJSON();
            return {
                ...materialData,
                event_name: Event.event_name,
            };
        });
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const deleter = async (req, res) => {
    try {
        const { material_Id } = req.params;
        const result = await Material.destroy({ where: { material_Id } });
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const update = async (req, res) => {
    try {
        const { material_Id } = req.params;
        const { event_Id, material_name, file, material_type } = req.body;
        const material = await Material.update({ event_Id, material_name, file, material_type }, { where: { material_Id } });
        return res.status(200).json(material);
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