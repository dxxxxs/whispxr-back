const Secret = require('../models/secret.model');
const { Op, Sequelize } = require('sequelize');

async function createSecret(secretData) {
    try {
        const secret = await Secret.create(secretData);
        return secret;
    } catch (error) {
        console.error('Error al crear el secreto:', error);
        throw error;
    }
}

async function getSecretByUUID(uuid) {
    try {
        const secret = await Secret.findOne({ where: { UUID: uuid } });
        return secret;
    } catch (error) {
        console.error('Error al obtener el secreto:', error);
        throw error;
    }
}

async function deleteSecret(uuid) {
    try {
        const result = await Secret.destroy({ where: { UUID: uuid } });
        return result > 0;
    } catch (error) {
        console.error('Error al eliminar el secreto:', error);
        throw error;
    }
}

async function deleteExpiredSecrets() {
    try {
        const now = new Date();
        const result = await Secret.destroy({
            where: {
                expiration: {
                    [Op.lt]: now
                }
            }
        });
        return result;
    } catch (error) {
        throw error;
    }
}


module.exports = {
    createSecret,
    getSecretByUUID,
    deleteSecret,
    deleteExpiredSecrets
};