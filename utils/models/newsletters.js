var db = require('../db');
var uuid = require('node-uuid');

db.connect();

exports.add = function(name, content, done) {
  id = uuid.v4();
  content.date = new Date().getTime();
  content.id = id;
  
  db.get().sadd("newsletters", "newsletter:"+id);
  db.get().hmset("newsletter:"+id, "id", id, "name", name, "content", JSON.stringify(content), done);
}

exports.update = function(id, content, done) {
  db.get().hset("newsletter:"+id, "content", JSON.stringify(content), done);
}

exports.get = function(id, done) {
  db.get().hgetall("newsletter:"+id, function(err, newsletter){
    done(err, newsletter.content);
  });
}

exports.delete = function(id, done) {
  var pipeline = db.get().pipeline();
  pipeline.srem("newsletters", "newsletter:"+id);
  pipeline.del("newsletter:"+id);

  pipeline.exec(done);
}

exports.all = function(done) {
  var newsletters = [];
  db.get().smembers("newsletters", function(err, items) {

    var pipeline = db.get().pipeline();

    items.forEach(function(key, index){
        pipeline.hgetall(key);
    });

    pipeline.exec(function(err, result){
        result.forEach(function(key, index){
          newsletters.push({ name: key[1].name, id: key[1].id });
        });
        done(err, newsletters);
    });
  });
}