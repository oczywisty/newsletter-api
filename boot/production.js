module.exports = function(app) {
  var hostname       = require("os").hostname(),
      expressStatsd  = require("express-statsd");
      bunyan         = require("express-bunyan-logger"),
      airbrake       = require("airbrake").createClient(process.env.AIRBRAKE_KEY, "production");


  // Send metrics to Datadog
  app.use(expressStatsd());

  // Logging in logstash format
  app.use(bunyan({
    parseUA: false, // Leave user-agent as raw string
    excludes: ["body", "short-body", "req-headers", "res-headers", "req", "res", "incoming", "response-hrtime"]
  }));

  // load proper app
  require("../app")(app);

  // Report exceptions to Airbrake
  app.use(airbrake.expressHandler());
  
  // production error handler
  // no stacktraces leaked to user
  app.use(function(err, req, res, next) {
    req.statsdKey = ["newsletter api", "errors", (err.status || 500)].join(".");
    res.status(err.status || 500);
    res.render("error", {
      message: err.message,
      error: {}
    });
  });
}
