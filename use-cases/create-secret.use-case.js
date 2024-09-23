const bcrypt = require('bcrypt');
const secretRepository = require('../repositories/secret.repository');
const counterRepository = require('../repositories/counter.repository');
const encryption = require('../_utils/encryption');

class CreateSecret {

    constructor({ secret, password, expiration }) { }

    async run() {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const encryptedSecret = await encryption.encrypt(secret, password);
        const uuid = crypto.randomUUID();

        const currentDate = new Date();
        const expirationDate = new Date(expiration);

        if (expirationDate <= currentDate) {
            return res.status(400).json({ error: 'La fecha de expiracion es pasado al presente' });
        }

        const secretData = {
            UUID: uuid,
            secret: encryptedSecret.encryptedData,
            iv: encryptedSecret.iv,
            password: hashedPassword,
            expiration: expirationDate,
        };


        const createdSecret = await secretRepository.createSecret(secretData);

        if (createdSecret) {
            await counterRepository.incrementCounter();
        }

        return createdSecret;
    }
}

module.exports = CreateSecret;