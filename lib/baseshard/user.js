var util = require('util');

var User = require('../user.js');

module.exports = [
  {
    path: '/login',
    method: 'GET',
    respond: function (req, res, db) {
      res.render('login.hbs', {nav: {login: true}});
    }
  },
  {
    path: '/login',
    method: 'POST',
    respond: function (req, res, db) {
      var user = new User({name: req.body.username}, req.body.password);
      user.auth(function (err) {
        if (typeof err !== 'undefined') {
          if (err.err === 'AUTH_FAILED')
            return res.send({err: 'Invalid username or password'});
          else {
            console.log(util.inspect(err));
            return res.status(500).send();
          }
        }
        req.session.user = user;
        res.status(204).send();
      });
    }
  },
  {
    path: '/logout',
    method: 'GET',
    respond: function (req, res, db) {
      delete req.session.user;
      res.redirect('/');
    }
  }
]