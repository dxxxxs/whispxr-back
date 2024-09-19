const Counter = require('../models/counter.model');

const incrementCounter = async () => {
    const [counter] = await Counter.findOrCreate({
        where: { id: 1 },
        defaults: { count: 0 }
    });
    counter.count += 1;
    await counter.save();
};

const getCounter = async () => {
    const counter = await Counter.findOne({ where: { id: 1 } });
    return counter ? counter.count : 0;
};

module.exports = {
    incrementCounter,
    getCounter,
};