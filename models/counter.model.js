const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Counter = sequelize.define('Counter', {
    count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    }
},
    {
        tableName: 'counter',
        timestamps: false,

    }
);

module.exports = Counter;