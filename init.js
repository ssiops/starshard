'use strict';

var assert = require('assert');
var async = require('async');
var fs = require('fs');
var wrench = require('wrench');

var Db = require('./lib/db.js');
var User = require('./lib/user.js');

var db = new Db();
var list = [];
if (fs.existsSync('./shards.json')) {
  console.log('Initing shards using shards.json.');
  list = require('./shards.json').list;
} else {
  console.log('Initing shards using package.json.');
  var dep = require('./package.json').dependencies;
  for (var n in dep) {
    if (n.search(/starshard\-/g) >= 0)
      list.push(n);
  }
}

async.parallel([
  function (callback) {
    wrench.mkdirSyncRecursive('./usercontent/usercontent/profile');
    return callback()
  },
  function (callback) {
    db.init(function (err) {
      return callback (err);
    });
  },
  function (callback) {
    db.find({admin: true}, 'users', {limit: 1}, function (err, docs) {
      if (docs.length < 1) {
        var user = new User({name: conf.root, admin: true}, conf.passwd);
        user.create(function (err) {
          return callback(err);
        });
      } else
        return callback(err);
    });
  },
  function (callback) {
    async.map(list, function (name, callback) {
      var shard = require(name);
      if (typeof shard.static !== 'undefined') {
        wrench.copyDirRecursive('./node_modules/' + name + '/' + shard.static, './_static/' + shard.name, {forceDelete: true}, function (err) {
          assert.equal(null, err);
          return callback(null);
        });
      } else 
        return callback(null);
    }, function (err, shards) {
      return callback(err);
    });
  }
], function (err) {
  assert.equal(null, err);
  console.log('Success.');
  process.exit();
});
