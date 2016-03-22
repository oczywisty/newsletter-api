"use strict";

var express = require("express");
var jade = require("jade");
var router  = express.Router();
var statsD  = require("../utils/statsd");
var newsletters = require("../utils/models/newsletters");

var EmailBuilder = require('email-builder-core');
var emailBuilder = new EmailBuilder({ encodeSpecialChars: true , relativePath: 'public'});

// GET /screencapture/
router.get("/", statsD("root"), function(req, res) {
  res.render("index", { title: "Express" });
});


// TODO go for database instead of the filesystem operations

router.route("/newsletters")
  .post( function(req, res) {
    var name = req.body.name;
    var content = req.body.content;

    console.log(content);

    try {
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

router.route('/newsletters/:uid/export')
  .get( function(req, res) {
    newsletters.get(req.params.uid, function(err, newsletter){
      if (err) {
        res.send(err);
      } else if (newsletter) {
        var newsletterContent = JSON.parse(newsletter);
        var filename = newsletterContent.name + "_v" + newsletterContent.version + ".html";

        emailBuilder.inlineCss(jade.compileFile('views/newsletter/index.jade')(newsletterContent)).then(function(html){
          res.setHeader('Content-disposition', 'attachment; filename=' + filename);
          res.send(html);
        });
      } else{
        res.send();
      }
    });
  });

module.exports = router;
