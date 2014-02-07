var Route = require('./route.js');
var Db = require('./db.js');
var User = require('./user.js');
var conf = require('../config.json');
var assert = require('assert');

var initShards = function (server) {
  var shards = require('../shards.json').list;
  server.shards = {};
  for (var i = 0; i < shards.length; i++) {
    var shard = require(shards[i]);
    if (shard.usedb == true)
      shard.db = new Db(shard.name);
    initStatic(shard.static);
    server.shards[shard.name] = shard;
    for (var j = 0; j < shard.routes.length; j++) {
      var route = new Route(shard.routes[j]);
      route.register(shard.name, server, shard.db);
    }
  }
}

var initDB = function (server) {
  var db = new Db();
  db.init();
  db.find({admin: true}, 'users', {limit: 1}, function (err, docs) {
    assert.equal(null, err);
    if (docs.length < 1) {
      var user = new User({name: conf.root, admin: true}, conf.passwd);
      user.create(function (err) {
        assert.equal(null, err);
        return;
      });
    }
    return;
  });
}

var initStatic = function (dir) {
  // TODO: copy static files of an application to /static/appname
}

module.exports = function (server) {
  initDB(server);
  initShards(server);
};