const controller = require("../controllers/healthcheck.controller");

module.exports = (app) => {
    app.get('/api/health-check', healtCheckController.healthCheck);
}