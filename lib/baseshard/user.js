var util = require('util');

var User = require('../user.js');
var Log = require('../log.js');

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
      console.log(req.session.redirect);
      var user = new User({name: req.body.username}, req.body.password);
      user.auth(function (err) {
        if (typeof err !== 'undefined') {
          if (err.err === 'AUTH_FAILED') {
            var log = new Log(req, 'User auth failed.', 'AUTH_FAIL');
            log.store();
            return res.send({err: 'Invalid username or password'});
          } else {
            console.log(util.inspect(err));
            return res.status(500).send();
          }
        }
        var log = new Log(req, 'User login.', 'AUTH_SUCCESS');
        log.store();
        req.session.user = user;
        var match = req.get('Referer').match(/\?.*redirect\=[a-zA-Z0-9]+/);
        if (match)
          return res.send({redirect: match[0].split('=')[1]});
        return res.status(204).send();
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
        var log = new Log(req, 'New user.', 'USER_NEW');
        log.store();
        req.session.user = user;
        res.status(201).send();
      });
    }
  },
  {
    path: '/profile/:username',
    method: 'GET',
    respond: function (req, res, db) {
      if (req.params.username == req.session.user.name) {
        // View profile as himself
        res.render('profile.hbs', {nav: {profile: true}, user: req.session.user, profile: req.session.user, self: true});
      } else {
        // View profile as others
        db.find({name: req.params.username}, 'users', {limit: 1}, function (err, docs) {
          if (err) {
            console.log(util.inspect(err));
            return res.status(500).send();
          }
          if (docs.length < 1)
            return res.render('404.hbs', {path: req.originalUrl});
          else
            return res.render('profile.hbs', {nav: {profile: true}, user: req.session.user, profile: docs[0], self: false});
        });
      }
    }
  },
  {
    path: '/preferences',
    method: 'GET',
    respond: function (req, res, db) {
      if (typeof req.session.user === 'undefined')
        return res.status(403).render('403.hbs', {path: req.originalUrl});
      res.render('preferences.hbs', {nav: {profile: true}, user: req.session.user, upload_success: req.query.up == 'ok', upload_fail: req.query.up == 'fail'});
    }
  },
  {
    path: '/preferences/password',
    method: 'PUT',
    respond: function (req, res, db) {
      if (typeof req.session.user === 'undefined')
        return res.status(403).send({err: 'Forbidden.'});
      var user = new User({name: req.session.user.name}, req.body.password_o);
      user.auth(function (err) {
        if (typeof err !== 'undefined') {
          if (err.err === 'AUTH_FAILED') {
            var log = new Log(req, 'User failed to change password. User: ' + req.session.user.name, 'PASSWORD_CHANGE_FAIL');
            log.store();
            return res.send({err: 'Invalid old password.'});
          } else {
            console.log(util.inspect(err));
            return res.status(500).send();
          }
        }
        var log = new Log(req, 'User password change: '  + req.session.user.name, 'PASSWORD_CHANGE');
        log.store();
        req.session.user = user;
        db.update({name: req.session.user.name}, {$set: {password: user.password}}, 'users', {}, function (err) {
          if (err) {
            console.log(util.inspect(err));
            return res.status(500).send();
          }
          res.send({msg: 'You have successfully changed your password.'});
        });
      });
    }
  },
  {
    path: '/preferences/account',
    method: 'DELETE',
    respond: function (req, res, db) {
      if (typeof req.session.user === 'undefined' || req.session.user.admin)
        return res.status(403).send({err: 'Forbidden.'});
      db.find({name: req.session.user.name}, 'users', {limit: 1}, function (err, docs) {
        if (err) {
          console.log(util.inspect(err));
          return res.status(500).send();
        }
        if (docs.length < 1) {
          console.log('Error: user' + req.session.user.name + ' missing from database.');
          return res.status(500).send();
        }
        if (docs[0].email != req.body.email) {
          var log = new Log(req, 'Account removal attempt: ' + req.session.user.name + ' ' + req.body.email, 'ACCOUNT_DELETE_FAIL');
          log.store();
          return res.send({err: 'This email address is not registered to this account.'});
        }
        db.remove({name: req.session.user.name}, 'users', {}, function (err) {
          if (err) {
            console.log(util.inspect(err));
            return res.status(500).send();
          }
          var log = new Log(req, 'Account deleted: ' + req.session.user.name, 'ACCOUNT_DELETE');
          log.store();
          delete req.session.user;
          res.send({msg: 'You have successfully removed your account.'});
        });
      });
    }
  }
]