var env = process.env.NODE_ENV || "development";

var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var cors = require("cors");
var utility_routes = require("./routes/utility");

var app = express();


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "store/newsletters")));
app.use(cors());

if (env === "production") {
  require("./boot/production")(app);
} else if (env === "test") {
  require("./boot/test")(app);
} else {
  require("./boot/development")(app);
}

// adds "/error" and "/server-status" endpoints
app.use("/", utility_routes);

// Catch all route
app.use(function(req, res, next) {
  req.statsdKey = ["newsletter-api", "errors", 404].join(".");

  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

module.exports = app;
