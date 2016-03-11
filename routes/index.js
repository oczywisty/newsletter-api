"use strict";

var express = require("express");
var router  = express.Router();
var statsD  = require("../utils/statsd");
var newsletters = require("../utils/models/newsletters");

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

    try {
      var content = JSON.parse(fs.readFileSync("store/newsletter-template/data.json", 'utf8'));
      newsletters.add(name, content, function(){
        res.json({ message: "Newsletter Created" });  
      });
    } catch (e) {
      res.send(e);
    }
  })
  .get( function(req, res) {
    newsletters.all(function(err, items){
      res.json(items);
    });
  });

router.route('/newsletters/:uid')
  .get( function(req, res) {
    newsletters.get(req.params.uid, function(err, newsletter){
      if (err) {
        res.send(err);
      } else if (newsletter) {
        res.json(JSON.parse(newsletter));  
      } else {
        res.json({});
      }
    });
  })
  .put( function(req, res) {
    newsletters.update(req.params.uid, req.body.content, function(){
      res.json({ message: "Newsletter saved successfully" });
    });
  })
  .delete( function(req, res) {
    newsletters.delete(req.params.uid, function(err, val){
      if (err) {
        res.send(err);
      } else {
        res.json({ message: "Newsletter deleted successfully"});
      }
    });
  });

router.route('/newsletters/:uid/preview')
  .get( function(req, res) {
    newsletters.get(req.params.uid, function(err, newsletter){
      if (err) {
        res.send(err);
      } else if (newsletter) {
        res.render("newsletter/index", JSON.parse(newsletter));  
      } else{
        res.send();
      }
    });
  });


module.exports = router;
