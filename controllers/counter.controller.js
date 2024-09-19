const counterRepository = require('../repositories/counter.repository');

exports.getCounter = async (req, res) => {
    try {

        const count = await counterRepository.getCounter();

        return res.status(201).send({ count: count });
    } catch (error) {
        return res.status(500).send({ msg: 'Error del contador', error: error.message });
    }
}