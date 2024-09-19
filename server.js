const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors');
const cron = require('node-cron');

dotenv.config();

const secretRepository = require('./repositories/secret.repository');

const app = express();
const port = process.env.PORT || 3000;

const corsOptions = {
    origin: 'https://whispxr.onrender.com',
    optionsSuccessStatus: 200
  };

app.use(cors(corsOptions));

app.use(express.json());

require("./routes")(app);

const deleteExpiredSecretsTask = cron.schedule('* * * * *', async () => {
    try {
        const deletedSecrets = await secretRepository.deleteExpiredSecrets();
    } catch (error) {
        console.error('Error en la tarea cron:', error);
    }
});

deleteExpiredSecretsTask.start();

app.listen(port, () => {
    console.log(` Servidor escuchando en http://localhost:${port}`);
});