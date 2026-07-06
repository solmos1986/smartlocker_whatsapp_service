const axios = require('axios');
const evolution = require('../config/evolution');

const sendImage = async (phone, imageUrl, caption) => {

    const url =
        `${evolution.baseUrl}/message/sendMedia/${evolution.instance}`;

    const payload = {

        number: phone,

        mediatype: "image",

        mimetype: "image/png",

        caption: caption,

        media: imageUrl,

        fileName: imageUrl.split('/').pop()

    };

    const headers = {

        apikey: evolution.apiKey,

        "Content-Type": "application/json"

    };

    try {

        const response = await axios.post(
            url,
            payload,
            {
                headers
            }
        );

        return {

            success: true,

            data: response.data

        };

    }
    catch (error) {

        console.error("===== ERROR EVOLUTION API =====");
        console.error(error);
        console.error("===============================");

        return {
            success: false,
            message: error.message,
            code: error.code,
            status: error.response?.status,
            data: error.response?.data || null
        };

    }

};

module.exports = {

    sendImage

};