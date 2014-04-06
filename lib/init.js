var assert = require('assert');
var fs = require('fs');
var async = require('async');
var wrench = require('wrench');
var exec = require('child_process').exec;

var pkg = require('../package.json');
var conf = require('../config.json');
var Route = require('./route.js');
var Db = require('./db.js');
var User = require('./user.js');

var initShards = function (server, shards, callback) {
  process.shards = [];
  async.map(shards, function (name, callback) {
    var shard = require(name);
    if (shard.usedb == 'true')
      shard.db = new Db(shard.name);
    process.shards.push({name: name, desc: shard.description, href: shard.name});
    async.parallel([
      function (callback) {
        if (typeof shard.static !== 'undefined') {
          wrench.copyDirRecursive('./node_modules/' + name + '/' + shard.static, './_static/' + shard.name, {forceDelete: true}, function (err) {
            assert.equal(null, err);
            return callback(null);
          });
        } else 
          return callback(null);
      },
      function (callback) {
        if (typeof shard.routes === 'undefined')
          return callback(null);
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
  async.parallel([function (callback) {
    db.init(function (err) {
      return callback (err);
    });
  }, function (callback) {
    db.find({admin: true}, 'users', {limit: 1}, function (err, docs) {
      if (docs.length < 1) {
        var user = new User({name: conf.root, admin: true}, conf.passwd);
        user.create(function (err) {
          return callback(err);
        });
      } else
        return callback(err);
    });
  }], function (err) {
    return callback(err);
  });
}

var initBase = function (server, callback) {
  var db = new Db();
  var shard = require('./baseshard/index.js');
  async.each(shard.routes, function (path, callback) {
    var route = new Route(path);
    route.register('', server, db);
    return callback(null);
  }, function (err) {
    assert.equal(null, err);
    return callback(null, shard);
  });
}

module.exports = function (server, callback) {
  async.series([function (callback) {
    var childProc;
    childProc = exec('grunt clean', function (err) {
      return callback(err);
    });
  }, function (callback) {
    fs.mkdir('./_static', function (err) {
      return callback(err);
    });
  }, function (callback) {
    async.parallel([
      function (callback) {
        console.log('Building static files.');
        var childProc;
        childProc = exec('grunt make', function (err, stdout, stderr) {
          if (err) {
            console.log('Grunt error: \n' , stdout)
            err.msg = 'Error building static files using grunt. Try `grunt make`.';
          }
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
      }, function (callback) {
        initBase(server, function (err) {
          return callback(err);
        });
      }], function (err) {
      return callback(err);
    });
  }], function (err) {
    return callback(err);
  })
};