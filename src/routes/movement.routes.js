const express = require('express');
const router = express.Router();

const movementController = require('../controllers/movement.controller');

router.get('/:codigo', movementController.getMovement);

module.exports = router;