"use strict";

var express = require("express");
var router  = express.Router();
var statsD  = require('../utils/statsd');

// Utility route for testing Airbrake
router.get("/error", statsD('error'), function(req, res) {
  throw new Error('test');
});

// Utility route for monitoring
router.get("/health-check", statsD('health-check'), function(req, res) {
  res.render("map", { layout: false, userData: JSON.stringify({}) });
});

// temproary because that's how ELB is set up
router.get("/server-status", statsD('health-check'), function(req, res) {
  res.render("map", { layout: false, userData: JSON.stringify({}) });
});

module.exports = router;
