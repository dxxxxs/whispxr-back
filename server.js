const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const cron = require('node-cron');
const secretRepository = require('./repositories/secret.repository');

const app = express();
const port = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());

require("./routes")(app);

cron.schedule('*/5 * * * *', async () => {
    dotenv.config();
    const deletedSecrets = await secretRepository.deleteExpiredSecrets();
    console.log(deletedSecrets);
})


app.listen(port, () => {
    console.log(` Servidor escuchando en http://localhost:${port}`);
});