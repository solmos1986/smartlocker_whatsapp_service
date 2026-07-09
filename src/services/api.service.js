const axios = require('axios');

const get = async (url, token) => {

    try {

        const response = await axios.get(

            url,

            {
                headers: {
                    Authorization: `Bearer ${token}`
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

    get

};