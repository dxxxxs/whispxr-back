const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Secret = sequelize.define('Secret', {
    UUID: {
        type: DataTypes.STRING(36),
        allowNull: false,
        unique: true
    },
    secret: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    iv: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    expiration: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },

},
    {
        tableName: 'secrets',
        timestamps: false,

    }
)

module.exports = Secret;