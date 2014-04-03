var Db = require('./db.js');
var db = new Db();

var util = require('util');

function Log(req, msg, tag) {
  this.url = req.originalUrl;
  this.ip = req.ip;
  this.ua = req.get('User-Agent');
  this.date = new Date();
  this.msg = msg;
  this.tag = tag;
  return this;
}

Log.prototype.store = function() {
  var _this = this;
  db.insert(_this, 'logs', {}, function (err) {
    if (err)
      console.log(util.inspect(err));
    return;
  })
};

module.exports = Log;