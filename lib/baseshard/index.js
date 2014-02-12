var shard = {};

shard.routes = [
  {
    path: '/',
    method: 'GET',
    respond: function (req, res, db) {
      res.render('index.hbs', {nav: {index: true}});
    }
  }
]

module.exports = shard;