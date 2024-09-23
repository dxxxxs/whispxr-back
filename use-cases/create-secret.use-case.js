const bcrypt = require('bcrypt');
const secretRepository = require('../repositories/secret.repository');
const counterRepository = require('../repositories/counter.repository');
const encryption = require('../_utils/encryption');

const ExpirationError = require('../error/expiration-error');

class CreateSecret {
    async run({ secret, password, expiration }) {

        const currentDate = new Date();
        const expirationDate = new Date(expiration);

        if (expirationDate <= currentDate) {
            throw new ExpirationError('La fecha de expiración no puede ser en el pasado');
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const encryptedSecret = await encryption.encrypt(secret, password);

        const uuid = crypto.randomUUID();

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