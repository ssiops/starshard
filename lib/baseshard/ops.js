var util = require('util');

var Log = require('../log.js');

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
  },
  {
    path: '/ops/logs',
    method: 'GET',
    respond: function (req, res, db) {
      if (typeof req.session.user === 'undefined' || req.session.user.admin !== true) {
        if (req.xhr)
          return res.status(403).send({err: 'Forbidden.'});
        else
          return res.status(403).render('403.hbs', {path: req.originalUrl});
      }
      var query = {};
      var opt = {limit: 20, sort: {_id: -1}};
      if (typeof req.query !== 'undefined') {
        if (typeof req.query.q !== 'undefined')
          query.tag = req.query.q;
        if (typeof req.query.l !== 'undefined')
          opt.limit = req.query.l;
      }
      db.find(query, 'logs', opt, function (err, docs) {
        if (err)
          return console.log('Error retrieving logs: ' + util.inspect(err));
        if (req.xhr) {
          res.render('logs.hbs', {layout: 'empty', logs: docs}, function (err, html){
            if (err)
              return res.send(err);
            return res.send({html: html});
          }); 
        } else {
          res.render('logs.hbs', {layout: 'container', logs: docs});
        }
      });
    }
  },
  {
    path: '/ops/users',
    method: 'GET',
    respond: function (req, res, db) {
      if (typeof req.session.user === 'undefined' || req.session.user.admin !== true) {
        if (req.xhr)
          return res.status(403).send({err: 'Forbidden.'});
        else
          return res.status(403).render('403.hbs', {path: req.originalUrl});
      }
      db.find({}, 'users', {sort: {_id: 1}}, function (err, docs) {
        if (err)
          return console.log('Error retrieving users: ' + util.inspect(err));
        if (req.xhr) {
          res.render('users.hbs', {layout: 'empty', users: docs}, function (err, html){
            if (err)
              return res.send(err);
            return res.send({html: html});
          }); 
        } else {
          res.render('users.hbs', {layout: 'container', users: docs});
        }
      });
    }
  },
  {
    path: '/ops/users',
    method: 'DELETE',
    respond: function (req, res, db) {
      if (typeof req.session.user === 'undefined' || req.session.user.admin !== true) {
        if (req.xhr)
          return res.status(403).send({err: 'Forbidden.'});
        else
          return res.status(403).render('403.hbs', {path: req.originalUrl});
      }
      if (typeof req.body.name === 'undefined')
        return res.send({err: 'You must specify a user name.'});
      if (req.body.name === req.session.user.name)
        return res.send({err: 'You cannot remove yourself.'});
      db.remove({name: req.body.name}, 'users', {}, function (err) {
        if (err)
          return console.log('Error retrieving users: ' + util.inspect(err));
        res.send({msg: 'Successfully removed user "' + req.body.name + '".'});
        var log = new Log(req, 'User removed: ' + req.body.name, 'USER_REMOVE');
        log.store();
      });
    }
  },
  {
    path: '/ops/users/admin',
    method: 'PUT',
    respond: function (req, res, db) {
      if (typeof req.session.user === 'undefined' || req.session.user.admin !== true) {
        if (req.xhr)
          return res.status(403).send({err: 'Forbidden.'});
        else
          return res.status(403).render('403.hbs', {path: req.originalUrl});
      }
      if (typeof req.body.name === 'undefined')
        return res.send({err: 'You must specify a user name.'});
      db.update({name: req.body.name}, {$set: {admin: true}}, 'users', {}, function (err) {
        if (err)
          return console.log('Error setting admin: ' + util.inspect(err));
        res.send({msg: 'Successfully set user "' + req.body.name + '" as admin.'});
        var log = new Log(req, 'User set as admin: ' + req.body.name, 'ADMIN_SET');
        log.store();
      });
    }
  },
  {
    path: '/ops/users/admin',
    method: 'DELETE',
    respond: function (req, res, db) {
      if (typeof req.session.user === 'undefined' || req.session.user.admin !== true) {
        if (req.xhr)
          return res.status(403).send({err: 'Forbidden.'});
        else
          return res.status(403).render('403.hbs', {path: req.originalUrl});
      }
      if (typeof req.body.name === 'undefined')
        return res.send({err: 'You must specify a user name.'});
      if (req.body.name === req.session.user.name)
        return res.send({err: 'You cannot unset yourself as admin.'});
      db.update({name: req.body.name}, {$set: {admin: false}}, 'users', {}, function (err) {
        if (err)
          return console.log('Error unsetting admin: ' + util.inspect(err));
        res.send({msg: 'Successfully removed user "' + req.body.name + '" from admins.'});
        var log = new Log(req, 'User unset as admin: ' + req.body.name, 'ADMIN_UNSET');
        log.store();
      });
    }
  }
]