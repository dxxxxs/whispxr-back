const controller = require("../controllers/counter.controller");

module.exports = function(app){
    app.get("/getCounter", controller.getCounter); 
}
