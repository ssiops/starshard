var assert = require('assert');
var fs = require('fs');
var async = require('async');
var cp = require('ncp').ncp;

var conf = require('../config.json');
var Route = require('./route.js');
var Db = require('./db.js');
var User = require('./user.js');

var initShards = function (server) {
  var shards = require('../shards.json').list;
  async.map(shards, function (name, callback) {
    var shard = require(name);
    if (shard.usedb == true)
      shard.db = new Db(shard.name);
    async.parallel([
      function (callback) {
        if (typeof shard.static !== 'undefined') {
          cp('./node_modules/' + name + '/' + shard.static, './static/' + shard.name, function (err) {
            assert.equal(null, err);
            return callback(null);
          });
        }
      },
      function (callback) {
        async.each(shard.routes, function (path, callback) {
          var route = new Route(path);
          route.register(shard.name, server, shard.db);
          return callback(null);
        }, function (err) {
          assert.equal(null, err);
          return callback(null, shard);
        });
      }
    ], function (err) {
      assert.equal(null, err);
      return callback(null, shard);
    });
  }, function (err, shards) {
    assert.equal(null, err);
    server.shards = shards;
  });
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
  initShards(server);
  initDB(server);
};