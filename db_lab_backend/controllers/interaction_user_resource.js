const InteractionUserResource = require("../models/InteractionUserResource");
const Resource = require("../models/Resource");
const User = require("../models/User")

const create = async (req, res) => {
    try {
        const { 
            is_liked,
            is_viewed,
            is_in_view_later,
            is_in_favourites,
            resource_Id
        } = req.body;
        const interaction = await InteractionUserResource.create({ 
            is_liked,
            is_viewed,
            is_in_view_later,
            is_in_favourites,
            resource_Id,
            user_Id: req.user.user_Id
        });
        return res.status(201).json(interaction);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getFromDb = async (req, res) => {
    throw new NotImplementedError();
};

const deleter = async (req, res) => {
    try {
        const { resource_Id, user_Id } = req.query;
        
        const result = await InteractionUserResource.destroy({ where: { resource_Id, user_Id } });
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const get_all_for_user = async (req, res) => {
    try {
        const { user_Id } = req.params;

        const interactions = await InteractionUserResource
            .findAll({
                where: {user_Id},
                include: {
                  model: Resource,
                  attributes: ["name"]
                }
            });
        const result = interactions.map(intraction => {
            const { Resource, ...interactionData } = intraction.toJSON();
            return {
                ...interactionData,
                resource_name: Resource.name,
            };
        });
        return res.status(200).json(result);
    }
    catch (error) {
       return res.status(500).json({ message: error.message });
    }
}

const update = async (req, res) => {
    try {
        const { 
            is_liked,
            is_viewed,
            is_in_view_later,
            is_in_favourites,
            resource_Id } = req.body;
        const user_Id = req.user.user_Id;
        
        const interaction = await InteractionUserResource.findOne({ 
            where: { resource_Id, user_Id } 
        });

        if (!interaction) {
            return res.status(404).json({ message: "Interaction record not found" });
        }

        const wasLiked = !!interaction.is_liked;
        const wasViewed = !!interaction.is_viewed;

        const updates = { 
            is_liked,
            is_viewed,
            is_in_view_later,
            is_in_favourites
        };

        Object.keys(updates).forEach(
            key => updates[key] == null && delete updates[key]
        );

        await interaction.update(updates);

        if (updates.hasOwnProperty('is_liked')) {
            const isNowLiked = !!updates.is_liked;

            if (wasLiked && !isNowLiked) {
                await Resource.decrement('likes_cache', { by: 1, where: { resource_Id } });
            } else if (!wasLiked && isNowLiked) {
                await Resource.increment('likes_cache', { by: 1, where: { resource_Id } });
            }
        }

        if (updates.hasOwnProperty('is_viewed')) {
            const isNowViewed = !!updates.is_viewed;

            if (wasViewed && !isNowViewed) {
                await Resource.decrement('views_cache', { by: 1, where: { resource_Id } });
            } else if (!wasViewed && isNowViewed) {
                await Resource.increment('views_cache', { by: 1, where: { resource_Id } });
            }
        }

        return res.status(200).json(interaction);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const create_or_update = async (req, res) => {
     try {
        const { resource_Id } = req.body;
        const user_Id = req.user.user_Id;

        let exists = await InteractionUserResource
            .findOne({
                where: {resource_Id, user_Id},
                attributes: ["interaction_user_resource_Id"]}) != null;
        if(exists) {
            return update(req, res);
        }
        else {
            return create(req, res);
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = {
  create,
  getFromDb,
  deleter,
  update,
  create_or_update,
  get_all_for_user
}