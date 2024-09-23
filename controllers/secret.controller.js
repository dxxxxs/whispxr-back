const axios = require('axios');
const bcrypt = require('bcrypt');
const encryption = require('../_utils/encryption');
const secretRepository = require('../repositories/secret.repository');
const counterRepository = require('../repositories/counter.repository');

const CreateSecret = require('../use-cases/create-secret.use-case');

exports.createSecret = async (req, res) => {
    try {

        const { secret, password, expiration } = req.body;

        const createdSecret = new CreateSecret({ secret, password, expiration });

        res.status(201).json({ message: 'Secreto creado satisfactoriamente.', uuid: createdSecret.getDataValue('UUID') });

    } catch (error) {
        res.status(500).json({ error: 'Ocurrió un error al crear el secreto: ', details: error.message });

    }
};


exports.getSecret = async (req, res) => {
    try {
        const { uuid } = req.params;
        const { password } = req.body;

        const secret = await secretRepository.getSecretByUUID(uuid);

        if (!secret) {
            return res.status(404).json({ error: 'Secreto no encontrado.' });
        }

        const hashedPassword = secret.getDataValue("password");
        const passwordMatches = await bcrypt.compare(password, hashedPassword);

        if (!passwordMatches) {
            return res.status(401).json({ error: 'Contraseña incorrecta.' });
        }

        const expiration = new Date(secret.getDataValue("expiration"));
        const currentDate = new Date();

        if (expiration <= currentDate) {
            await secretRepository.deleteSecret(uuid);
            return res.status(410).json({ error: 'La fecha de expiracion ha pasado' });
        }

        const iv = secret.getDataValue("iv");
        const secretMessage = secret.getDataValue("secret");

        const encryptedData = {
            iv: iv,
            encryptedData: secretMessage
        };

        const decryptedSecret = await encryption.decrypt(encryptedData, password);

        await secretRepository.deleteSecret(uuid);

        res.status(201).json({ secret: decryptedSecret });

    } catch (error) {
        res.status(500).json({ error: 'Ocurrió un error al solicitar el secreto: ', details: error.message });
    }
}