const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

const sendImage = async (phone, qrFile) => {

    try {

        console.log('========================================');
        console.log('Enviando WhatsApp...');
        console.log('Destino:', phone);
        console.log('QR:', qrFile);

        const filePath = path.join(
            process.env.QR_STORAGE,
            qrFile
        );

        if (!fs.existsSync(filePath)) {

            throw new Error(`No existe el archivo: ${filePath}`);

        }

        const stats = fs.statSync(filePath);

        console.log('Archivo:', filePath);
        console.log('Tamaño:', stats.size, 'bytes');

        const form = new FormData();

        form.append(
            'number',
            phone
        );

        form.append(
            'mediatype',
            'image'
        );

        form.append(
            'media',
            fs.createReadStream(filePath)
        );

        form.append(
            'caption',
            'Tiene un paquete pendiente por recoger.'
        );

        // form.append(
        //     'fileName',
        //     qrFile
        // );

        const start = Date.now();

        const response = await axios.post(

            `${process.env.EVOLUTION_URL}/message/sendMedia/${process.env.EVOLUTION_INSTANCE}`,

            form,

            {

                headers: {

                    apikey: process.env.EVOLUTION_API_KEY,

                    ...form.getHeaders()

                },

                timeout: 30000,

                maxBodyLength: Infinity

            }

        );

        const elapsed = Date.now() - start;

        console.log('Evolution respondió en', elapsed, 'ms');
        console.log(response.data);
        console.log('========================================');

        return {

            success: true,

            elapsed,

            data: response.data

        };

    } catch (error) {

        console.log('========================================');
        console.log('Error enviando WhatsApp');
        console.log(error.code);
        console.log(error.message);

        if (error.response) {

            console.log('Status:', error.response.status);
            console.log(error.response.data);

        }

        console.log('========================================');

        return {

            success: false,

            code: error.code,

            status: error.response?.status,

            message:
                error.response?.data ||
                error.message

        };

    }

};

module.exports = {

    sendImage

};