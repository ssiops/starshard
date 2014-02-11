var assert = require('assert');
var fs = require('fs');
var async = require('async');
var cp = require('ncp').ncp;
var rm = require('rimraf');

var pkg = require('../package.json');
var conf = require('../config.json');
var Route = require('./route.js');
var Db = require('./db.js');
var User = require('./user.js');

var initShards = function (server, shards, callback) {
  async.map(shards, function (name, callback) {
    var shard = require(name);
    if (shard.usedb == true)
      shard.db = new Db(shard.name);
    async.parallel([
      function (callback) {
        if (typeof shard.static !== 'undefined') {
          cp('./node_modules/' + name + '/' + shard.static, './_static/' + shard.name, function (err) {
            assert.equal(null, err);
            return callback(null);
          });
        } else 
          return callback(null);
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
    server.shards = shards;
    return callback(err);
  });
}

var initDB = function (server, callback) {
  var db = new Db();
  db.init();
  db.find({admin: true}, 'users', {limit: 1}, function (err, docs) {
    if (docs.length < 1) {
      var user = new User({name: conf.root, admin: true}, conf.passwd);
      user.create(function (err) {
        return callback(err);
      });
    } else
      return callback(err);
  });
}

module.exports = function (server, callback) {
  rm('./_static', function (err) {
    assert.equal(null, err);
    async.parallel([
      function (callback) {
        cp('./static', './_static', function (err) {
          return callback(err);
        });
      }, function (callback) {
        var list = [];
        if (fs.existsSync('./shards.json')) {
          console.log('Initing shards using shards.json.');
          list = require('../shards.json').list;
        } else {
          console.log('Initing shards using package.json.');
          var dep = require('../package.json').dependencies;
          for (var n in dep) {
            if (n.search(/starshard\-/g) >= 0)
              list.push(n);
          }
        }
        initShards(server, list, function (err) {
          return callback(err);
        });
      }, function (callback) {
        initDB(server, function (err) {
          return callback(err);
        });
      }], function (err) {
      return callback(err);
    });
  });
};