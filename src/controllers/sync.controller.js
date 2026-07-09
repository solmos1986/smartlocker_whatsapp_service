const syncService = require('../services/sync.service');

const syncUsers = async (req, res, next) => {

    try {

        const buildingId = req.params.buildingId || null;

        const result = await syncService.syncUsers(buildingId);

        return res.json(result);

    } catch (error) {

        next(error);

    }

};

module.exports = {
    syncUsers
};