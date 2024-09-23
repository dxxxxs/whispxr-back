const CreateSecret = require('../use-cases/create-secret.use-case');
const GetSecret = require('../use-cases/get-secret.use-case');

const ExpirationError = require('../error/expiration-error');
const InvalidPasswordError = require('../error/invalid-password');
const SecretNotFoundError = require('../error/secret-not-found');

exports.createSecret = async (req, res) => {
    try {

        const { secret, password, expiration } = req.body;

        const createSecret = new CreateSecret();

        const createdSecret = await createSecret.run({ secret, password, expiration });

        return res.status(200).json({
            message: 'Secreto creado satisfactoriamente.',
            uuid: createdSecret.UUID
        });

    } catch (error) {
        if (error instanceof ExpirationError) {
            return res.status(400).json({ error: error.message });
        } else {
            return res.status(500).json({ error: 'Ocurrió un error al crear el secreto: ', details: error.message });
        }

    }
};


exports.getSecret = async (req, res) => {
    try {
        const { uuid } = req.params;
        const { password } = req.body;

        const getSecret = new GetSecret();

        const secret = await getSecret.run({ uuid, password });

        return res.status(200).json({ secret: secret });

    } catch (error) {
        if (error instanceof InvalidPasswordError) {
            return res.status(401).json({ error: message });
        } else if (error instanceof ExpirationError) {
            return res.status(410).json({ error: message });
        } else if (error instanceof SecretNotFoundError) {
            return res.status(404).json({ error: message });
        } else {
            return res.status(500).json({
                error: 'Ocurrió un error al solicitar el secreto: ',
                details: error.message
            });
        }
    }
}