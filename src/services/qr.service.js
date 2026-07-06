const QRCode = require('qrcode');
const path = require('path');

const generate = async (code) => {

    const fileName = `${code}.png`;

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