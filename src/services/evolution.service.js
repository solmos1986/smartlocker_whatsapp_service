const axios = require('axios');

const normalizePhone = (phone) => {

    phone = String(phone || '').trim();

    // Dejar solo números
    phone = phone.replace(/\D/g, '');

    // Si es un número boliviano de 8 dígitos
    if (phone.length === 8) {
        phone =phone;
    }

    return phone;

};

const checkWhatsAppNumbers = async (users) => {

    const numbers = [];
    const numbersSet = new Set();

    // Relaciona el número normalizado con todos los usuarios
    const userMap = {};

    for (const user of users) {

        const phone = normalizePhone(user.phone);

        if (!phone) {
            continue;
        }

        if (!userMap[phone]) {
            userMap[phone] = [];
        }

        userMap[phone].push(user);

        if (!numbersSet.has(phone)) {

            numbersSet.add(phone);
            numbers.push(phone);

        }

    }


    try {

        const response = await axios.post(

            `${process.env.EVOLUTION_URL}/chat/whatsappNumbers/${process.env.EVOLUTION_INSTANCE}`,

            {
                numbers
            },

            {
                headers: {
                    apikey: process.env.EVOLUTION_API_KEY,
                    'Content-Type': 'application/json'
                },
                timeout: 10000
            }

        );

        const existsMap = {};

        for (const item of response.data) {

            existsMap[item.number] = item.exists;

        }

        const resultUsers = [];

        for (const phone of Object.keys(userMap)) {

            for (const user of userMap[phone]) {

                resultUsers.push({

                    building_id: user.building_id,

                    departmentName: user.departmentName,

                    name: user.name,

                    phone: user.phone,

                    normalizedPhone: phone,

                    has_whatsapp: existsMap[phone] || false

                });

            }

        }

        return {

            success: true,

            totalNumbers: numbers.length,

            totalUsers: users.length,

            evolution: response.data,

            users: resultUsers

        };

    } catch (error) {

     

        return {

            success: false,

            code: error.code,

            message: error.message,

            data: error.response?.data

        };

    }

};

module.exports = {

    checkWhatsAppNumbers

};