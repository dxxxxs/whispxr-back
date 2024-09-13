const { Sequelize } = require('sequelize');


const DB_CONFIG = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
};

// Configuración de la conexión a la base de datos
const sequelize = new Sequelize(DB_CONFIG.database, DB_CONFIG.user, DB_CONFIG.password, {
    host: DB_CONFIG.host,
    dialect: 'mysql',
    port: DB_CONFIG.port,
    logging: false,
    define: {
        timestamps: false,
    },
});



module.exports = sequelize;