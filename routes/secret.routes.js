const controller = require("../controllers/secret.controller");

module.exports = function(app){
    app.post("/gensecret", controller.createSecret); 
    app.post("/secret/:uuid", controller.getSecret);
}
