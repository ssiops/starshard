var assert = require('assert');

var params = {
  "hostname":"localhost",
  "port":27017,
  "username":"",
  "password":"",
  "name":"",
  "db":"starshard"
};

function Db (name) {
  if (typeof name !== 'undefined') {
    params.name = 'shard_' + name;
  }
  this.mongodb = require('mongodb');
  this.mongourl = "mongodb://" + params.hostname + ":" + params.port + "/" + params.db;
  this.client = this.mongodb.MongoClient;
  return this;
}

Db.prototype.insert = function (data, coll, options, callback) {
  var self = this;
  self.client.connect(self.mongourl, function (err, db) {
    if (err) {
      callback(err);
      return self;
    }
    if (typeof db === 'undefined') {
      console.log('Failed to establish Mongodb connection.');
      return self;
    }

    db.collection(coll).insert(data, options, function (err, data) {
      if (err) {
        callback(err);
        return self;
      }
      db.close();
      callback(err, data)
      return self;
    });
  });
}

Db.prototype.remove = function (query, coll, options, callback) {
  var self = this;
  self.client.connect(self.mongourl, function (err, db) {
    if (err) {
      callback(err);
      return self;
    }
    if (typeof db === 'undefined') {
      console.log('Failed to establish Mongodb connection.');
      return self;
    }

    db.collection(coll).remove(query, options, function (err, data) {
      if (err) {
        callback(err);
        return self;
      }
      db.close();
      callback(null, data);
      return self;
    });
  });
}

Db.prototype.update = function (query, data, coll, options, callback) {
  var self = this;
  self.client.connect(self.mongourl, function (err, db) {
    if (err) {
      callback(err);
      return self;
    }
    if (typeof db === 'undefined') {
      console.log('Failed to establish Mongodb connection.');
      return self;
    }

    db.collection(coll).update(query, data, options, function (err, data) {
      if (err) {
        callback(err);
        return self;
      }
      db.close();
      callback(null, data);
      return self;
    });
  });
}

Db.prototype.find = function (query, coll, options, callback) {
  var self = this;
  self.client.connect(self.mongourl, function (err, db) {
    if (err) {
      callback(err);
      return self;
    }
    if (typeof db === 'undefined') {
      console.log('Failed to establish Mongodb connection.');
      return self;
    }

    db.collection(coll).find(query, options).toArray(function (err, docs) {
      if (err) {
        callback(err);
        return self;
      }
      db.close();
      callback(null, docs);
      return self;
    });
  });
}

Db.prototype.init = function (callback) {
  var _this = this;
  this.index(function (err) {
    callback(err);
    return _this;
  });
}

Db.prototype.index = function (callback) {
  var _this = this;
  this.client.connect(this.mongourl, function (err, db) {
    assert.equal(null, err);
    assert.ok(db != null);
    db.collection('users').ensureIndex({name: 1}, {unique: true}, function (err, indexName) {
      assert.equal(null, err);
      db.collection('logs').ensureIndex({date: 1}, {expireAfterSeconds: 2764800}, function (err, indexName) {
        callback(err);
        return _this;
      })
    });
  });
};

module.exports = Db;
