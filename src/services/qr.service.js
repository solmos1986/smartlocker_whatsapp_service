const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');

const generate = async (code) => {

    const fileName = `${code}.png`;

    console.log("QR_STORAGE:", process.env.QR_STORAGE);

    // Crear el directorio si no existe
    fs.mkdirSync(process.env.QR_STORAGE, { recursive: true });

    const filePath = path.join(
        process.env.QR_STORAGE,
        fileName
    );

    console.log("Generando:", filePath);

    await QRCode.toFile(filePath, code);

    console.log("QR generado:", filePath);
console.log("Existe:", fs.existsSync(filePath));

    return fileName;
};

module.exports = {
    generate
};