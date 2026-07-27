const movementService = require('../services/movement.service');

const getMovement = async (req, res) => {
    try {
        console.log(">>> Entró al controller", req.params.codigo);
        const { codigo } = req.params;

        const result = await movementService.getMovement(codigo);

        res.status(200).json(result);

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getMovement
};