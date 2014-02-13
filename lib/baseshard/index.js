var shard = {};

shard.routes = [
  {
    path: '/',
    method: 'GET',
    respond: function (req, res, db) {
      res.render('index.hbs', {
        nav: {index: true},
        user: req.session.user
      });
    }
  }
].concat(require('./user.js'));

module.exports = shard;