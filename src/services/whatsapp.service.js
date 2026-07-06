const fs = require('fs');
const path = require('path');
const axios = require('axios');

const sendImage = async (phone, qrFile) => {

    try {

        const filePath = path.join(
            process.env.QR_STORAGE,
            qrFile
        );

        const imageBuffer = fs.readFileSync(filePath);

        const base64Image = imageBuffer.toString('base64');

        const response = await axios.post(

            `${process.env.EVOLUTION_URL}/message/sendMedia/${process.env.EVOLUTION_INSTANCE}`,

            {
                number: phone,
                mediatype: 'image',
                mimetype: 'image/png',
                caption: 'Tiene un paquete pendiente por recoger.',
                media: base64Image,
                fileName: qrFile
            },

            {
                headers: {
                    apikey: process.env.EVOLUTION_API_KEY,
                    'Content-Type': 'application/json'
                }
            }

        );

        return {

            success: true,

            data: response.data

        };

    } catch (error) {

        return {

            success: false,

            message:
                error.response?.data ||
                error.message

        };

    }

};

module.exports = {

    sendImage

};

module.exports = {

    sendImage

};