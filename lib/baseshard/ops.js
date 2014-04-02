module.exports = [
  {
    path: '/ops',
    method: 'GET',
    respond: function (req, res, db) {
      if (typeof req.session.user === 'undefined' || req.session.user.admin !== true) {
        return res.status(403).render('403.hbs', {path: req.originalUrl});
      }
      res.render('ops.hbs', {nav: {ops: true}, shards: process.shards});
    }
  }
]