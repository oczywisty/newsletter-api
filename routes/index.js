"use strict";

var express = require("express");
var router  = express.Router();
var statsD  = require("../utils/statsd");
var fs = require("fs");
var ncp = require('ncp').ncp;

// GET /screencapture/
router.get("/", statsD("root"), function(req, res) {
  res.render("index", { title: "Express" });
});


// TODO go for database instead of the filesystem operations

router.route("/newsletters")
  .post( function(req, res) {
    var name = req.body.name;
    var path = 'store/newsletters/' + name;

    try {
      fs.accessSync(path, fs.F_OK);
      res.status(500).send({ error: "Newsletter with that name exists" });
    } catch (e) {
      ncp('store/newsletter-template', 'store/newsletters/' + name, function (err) {
        if (err) {
          res.send(err);
        }
        res.json({ message: "Newsletter Created" });
      });
    }
  })
  .get( function(req, res) {
    var newsletters = fs.readdirSync('store/newsletters/');
    res.json(newsletters);
  });

router.route('/newsletters/:newsletter_name')
  .get( function(req, res) {
    var name = req.params.newsletter_name;
    var path = "store/newsletters/" + name + "/data.json";

    try {
      var newsletter = fs.readFileSync(path, 'utf8');
      res.json(JSON.parse(newsletter));
    } catch (e) {
      res.send(e);
    }
  })
  .put( function(req, res) {
    var name = req.params.newsletter_name;
    var path = "store/newsletters/" + name + "/data.json";

    try {
      fs.writeFileSync(path, JSON.stringify(req.body.content), 'utf8')
      res.json({ message: "Newsletter saved successfully" });
    } catch (e) {
      res.send(e);
    }
  })
  .delete( function(req, res) {
    var name = req.params.newsletter_name;
    var path = "store/newsletters/" + name;

    try {
      fs.unlinkSync(path); // FIX delete recursive https://www.npmjs.com/package/rimraf
      res.json({ message: "Newsletter deleted successfully"})
    } catch (e) {
      res.send(e);
    }
  });

router.route('/newsletters/:newsletter_name/preview')
  .get( function(req, res) {
    var name = req.params.newsletter_name;
    var path = "store/newsletters/" + name + "/data.json";

    try {
      var newsletter = fs.readFileSync(path, 'utf8');
      res.render("newsletter/index", JSON.parse(newsletter));
    } catch (e) {
      res.send(e);
    }
  });


module.exports = router;
