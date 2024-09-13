const axios = require('axios');
const bcrypt = require('bcrypt');
const encryption = require('../_utils/encryption');
const secretRepository = require('../repositories/secret.repository');


exports.createSecret = async (req, res) => {
    try {

        const { secret, password, expiration } = req.body;

        const saltRounds = 10;

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const encryptedSecret = await encryption.encrypt(secret, password);
        const uuid = crypto.randomUUID();

        const currentDate = new Date();
        const expirationDate = new Date(expiration);

        if (expirationDate <= currentDate) {
            return res.status(500).json({ error: 'La fecha de expiracion es pasado al presente' });
        }

        const secretData = {
            UUID: uuid,
            secret: encryptedSecret.encryptedData,
            iv: encryptedSecret.iv,
            password: hashedPassword,
            expiration: expirationDate,
        };


        const createdSecret = await secretRepository.createSecret(secretData);

        res.status(200).json({ message: 'Secreto creado satisfactoriamente.', uuid: createdSecret.getDataValue('UUID')});

    } catch (error) {
        res.status(500).json({ error: 'Ocurrió un error al crear el secreto: ', details: error.message });

    }
};


exports.getSecret = async (req, res) => {
    try {
        const { uuid } = req.params;
        const { password } = req.body;

        const secret = await secretRepository.getSecretByUUID(uuid);

        const hashedPassword = secret.getDataValue("password");
        const passwordMatches = await bcrypt.compare(password, hashedPassword);

        if (!passwordMatches) {
            return res.status(400).json({ error: 'Contraseña incorrecta.' });
        }

        const expiration = new Date(secret.getDataValue("expiration"));
        const currentDate = new Date();

        if (expiration <= currentDate) {
            await secretRepository.deleteSecret(uuid);
            return res.status(400).json({ error: 'La fecha de expiracion ha pasado' });
        }

        const iv = secret.getDataValue("iv");
        const secretMessage = secret.getDataValue("secret");

        const encryptedData = {
            iv: iv,
            encryptedData: secretMessage
        };

        const decryptedSecret = await encryption.decrypt(encryptedData, password);

        await secretRepository.deleteSecret(uuid);

        res.status(200).json({ secret: decryptedSecret });

    } catch (error) {
        res.status(500).json({ error: 'Ocurrió un error al solicitar el secreto: ', details: error.message });
    }
}