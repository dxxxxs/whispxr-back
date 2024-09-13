module.exports = (app) => {
    require("./secret.routes")(app);
    require("./healthcheck.routes")(app);
}