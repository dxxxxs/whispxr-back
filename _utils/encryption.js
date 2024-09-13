const crypto = require('crypto');
const algorithm = 'aes-256-cbc';

// Función para generar una clave a partir de una contraseña
function getKeyFromPassword(password) {
    return crypto.pbkdf2Sync(password, 'salt', 100000, 32, 'sha256');
}

// Función para encriptar texto
async function encrypt(text, password) {
    const key = getKeyFromPassword(password); // Generar clave desde la contraseña
    const iv = crypto.randomBytes(16); // Generar un IV aleatorio
    let cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return { iv: iv.toString('hex'), encryptedData: encrypted };
}

// Función para desencriptar texto
async function decrypt(encryptedText, password) {
    const key = getKeyFromPassword(password); // Generar clave desde la contraseña
    const iv = Buffer.from(encryptedText.iv, 'hex');
    const encryptedData = Buffer.from(encryptedText.encryptedData, 'hex');
    let decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

module.exports = {
    encrypt,
    decrypt
}