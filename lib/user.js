var Db = require('./db.js');

function User (opt, password) {
  for (var prop in opt) {
    this[prop] = opt[prop];
  }
  if (typeof password !== 'undefined') {
    this.password = this.hash(password);
  }
  return this;
}

User.prototype.hash = function(input) {
  var md5 = require('crypto').createHash('md5');
  var sha = require('crypto').createHash('sha256');
  sha.update(input, 'utf8');
  return sha.update(md5.update(this.name, 'utf8').digest('hex'), 'utf8').digest('base64');
};

User.prototype.auth = function(callback) {
  var db = new Db();
  var self = this;
  db.find({name: this.name, password: this.password}, 'users', {limit: 1}, function (err, docs) {
    if (err)
      return callback(err);
    else if (docs.length < 1) {
      return callback({err: 'AUTH_FAILED', msg: 'Error: Invalid username or password'});
    } else {
      for (var prop in docs[0]) {
        self[prop] = docs[0][prop];
      }
      delete self.password;
      return callback();
    }
  });
};

User.prototype.create = function(callback) {
  var self = this;
  var db = new Db();
  db.insert(self, 'users', {}, function (err) {
    callback(err);
    return self;
  });
};

module.exports = User;