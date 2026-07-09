const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');

const generate = async (code) => {

    const fileName = `${code}.png`;

   

    // Crear el directorio si no existe
    fs.mkdirSync(process.env.QR_STORAGE, { recursive: true });

    const filePath = path.join(
        process.env.QR_STORAGE,
        fileName
    );

    await QRCode.toFile(filePath, code);

    return fileName;
};

module.exports = {
    generate
};