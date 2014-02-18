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
  },
  {
    path: '/register',
    method: 'GET',
    respond: function (req, res, db) {
      res.render('register.hbs', {nav: {register: true}});
    }
  },
  {
    path: '/register',
    method: 'PUT',
    respond: function (req, res, db) {
      if (req.body.username && (req.body.username.length < 2 || req.body.username.length > 16 || req.body.username.search(/^[a-zA-Z0-9\-\_\.]/) < 0)) {
        res.send({err: 'Your username must be 2~16 characters long with only English letters, numbers, "-", "_" and ".".'});
        return;
      }
      if (req.body.password && (req.body.password.length < 6 || req.body.password.length > 20)) {
        res.send({err: 'Your password must be 6~20 charaters long.'});
        return;
      }
      if (req.body.email && (req.body.email.length < 1 || req.body.email.search(/[a-zA-z0-9]+@[a-zA-z0-9]+\.[a-zA-z]+/) < 0)) {
        res.send({err: 'Please enter a valid email address.'});
        return;
      }
      req.body.name = req.body.username;
      delete req.body.username;
      var user = new User(req.body, req.body.password);
      user.create(function (err) {
        if (err) {
          res.send(err);
          return;
        }
        req.session.user = user;
        res.status(201).send();
      });
    }
  }
]