module.exports = function(app) {
  var routes = require("./routes/index");

  app.use("/", routes);
};
