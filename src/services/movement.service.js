const movementRepository = require('../data/movement.repository');
const qrService = require('./qr.service');
const whatsappService = require('./whatsapp.service');

const getMovement = async (codigo) => {
    console.log(">>> Entró a getMovement:", codigo);
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
    console.log('contactosSSSSSSSSSSSSSS: ', contacts);

    const qrFile = await qrService.generate(codigo);

    const imageUrl =
    `${process.env.STATIC_FILES_URL}/${qrFile}`;
    
    // const whatsappResults = [];

    // for (const contact of contacts) {

    // const result =
    //     await whatsappService.sendImage(
    //         contact.celular,
    //         qrFile
    //     );

    // whatsappResults.push({

    //     phone: contact.celular,

    //     result

    // });

    // }
    const whatsappQueue =
        require('../queue/whatsapp.queue');

    for (const contact of contacts) {

        await whatsappQueue.enqueue({

            phone: contact.celular,

            qrFile

        });

    }
    return {

    success: true,

    movement,

    contacts,

    qr: qrFile,

    imageUrl,

    queued: contacts.length

    };

};

module.exports = {
    getMovement
};