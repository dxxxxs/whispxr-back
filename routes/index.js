module.exports = (app) => {
    require("./secret.routes")(app);
    require("./healthcheck.routes")(app);
    require("./counter.routes")(app);
}