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

        const url =
            `${process.env.EVOLUTION_URL}/message/sendMedia/${process.env.EVOLUTION_INSTANCE}`;

        console.log('URL:', url);
       

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

        // form.append(
        //     'fileName',
        //     qrFile
        // );

        form.append(
            'caption',
            'Tiene un paquete pendiente por recoger.'
        );

        const start = Date.now();
        console.log('consolessss antes de axiosss post');
console.dir(form.getHeaders(), { depth: null });
console.log(process.env.EVOLUTION_API_KEY);
console.dir(form, { depth: 2 });
console.log(form._streams);
        const response = await axios.post(

            url,

            form,

            {

                headers: {

                    apikey: process.env.EVOLUTION_API_KEY,

                    ...form.getHeaders()

                },

                maxBodyLength: Infinity,

                timeout: 30000

            }

        );

        const elapsed = Date.now() - start;

        console.log('========================================');
        console.log('Evolution respondió en', elapsed, 'ms');
        console.dir(response.data, { depth: null });
        console.log('========================================');

        return {

            success: true,

            elapsed,

            data: response.data

        };

    } catch (error) {

        console.log('========================================');
        console.log('===== ERROR EVOLUTION API =====');

        console.log('CODE:', error.code);
        console.log('MESSAGE:', error.message);

        if (error.response) {

            console.log('STATUS:', error.response.status);
            console.dir(error.response.data, { depth: null });

        }

        console.dir(error, { depth: 2 });

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