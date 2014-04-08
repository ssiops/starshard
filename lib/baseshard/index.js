var shard = {};
var Log = require('../log.js');

shard.routes = [
  {
    path: '/',
    method: 'GET',
    respond: function (req, res, db) {
      var log = new Log(req, 'Default access');
      log.store();
      res.render('index.hbs', {
        nav: {index: true},
        user: req.session.user
      });
    }
  }
].concat(
  require('./user.js'), 
  require('./ops.js'),
  require('./usercontent.js')
);

module.exports = shard;