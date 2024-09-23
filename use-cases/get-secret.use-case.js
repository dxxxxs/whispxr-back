const bcrypt = require('bcrypt');
const secretRepository = require('../repositories/secret.repository');
const encryption = require('../_utils/encryption');

const ExpirationError = require('../error/expiration-error');
const InvalidPasswordError = require('../error/invalid-password');
const SecretNotFoundError = require('../error/secret-not-found');

class GetSecret {

    #decryptedSecret;

    async run({ uuid, password }) {

        const secret = await secretRepository.getSecretByUUID(uuid);

        if (!secret) {
            throw new SecretNotFoundError('Secreto no encontrado');
        }

        const hashedPassword = secret.getDataValue("password");
        const passwordMatches = await bcrypt.compare(password, hashedPassword);

        if (!passwordMatches) {
            throw new InvalidPasswordError('Contraseña incorrecta');
        }

        const expiration = new Date(secret.getDataValue("expiration"));
        const currentDate = new Date();

        if (expiration <= currentDate) {
            await secretRepository.deleteSecret(uuid);
            throw new ExpirationError('El secreto ha expirado');
        }

        const iv = secret.getDataValue("iv");
        const secretMessage = secret.getDataValue("secret");

        const encryptedData = {
            iv: iv,
            encryptedData: secretMessage
        };

        this.#decryptedSecret = await encryption.decrypt(encryptedData, password);

        await secretRepository.deleteSecret(uuid);

        return this.#decryptedSecret;
    }
}

module.exports = GetSecret;