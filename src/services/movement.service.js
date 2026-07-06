const movementRepository = require('../data/movement.repository');
const qrService = require('./qr.service');
const whatsappService = require('./whatsapp.service');

const getMovement = async (codigo) => {

    const movement = await movementRepository.findMovementByCode(codigo);

    if (!movement) {
        return {
            success: false,
            message: 'Movimiento no encontrado.'
        };
    }

    const contacts = await movementRepository.findDepartmentContacts(
        movement.department_id
    );

    const qrFile = await qrService.generate(codigo);

    const imageUrl =
    `${process.env.STATIC_FILES_URL}/${qrFile}`;

    const whatsappResults = [];

    for (const contact of contacts) {

    const result =
        await whatsappService.sendImage(
            contact.celular,
            qrFile
        );

    whatsappResults.push({

        phone: contact.celular,

        result

    });

    }
    return {

    success: true,

    movement,

    contacts,

    qr: qrFile,

    imageUrl,

    whatsapp: whatsappResults

    };

};

module.exports = {
    getMovement
};