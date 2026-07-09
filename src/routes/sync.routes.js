const express = require('express');
const router = express.Router();

const syncController = require('../controllers/sync.controller');

router.get('/users', syncController.syncUsers);

router.get('/users/:buildingId', syncController.syncUsers);

module.exports = router;