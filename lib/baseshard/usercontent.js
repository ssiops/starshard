var util = require('util');
var fs = require('fs');
var gm = require('gm');

var Db = require('../db.js');
var db = new Db();
var User = require('../user.js');
var Log = require('../log.js');

module.exports = [
  {
    path: '/usercontent/profile',
    method: 'POST',
    respond: function (req, res, db) {
      if (typeof req.session.user === 'undefined') {
        return res.status(403).render('403.hbs', {path: req.originalUrl});
      }
      if (typeof req.files === 'undefined' || typeof req.files.img === 'undefined') {
        return res.status(404).render('404.hbs', {path: req.originalUrl});
      }
      var imgStream = fs.createReadStream(req.files.img.path);
      var writeName = req.session.user.name + '_' + new Date().getTime() + '.jpg';
      var writePath = process.cwd() + '/usercontent/usercontent/profile/' + writeName;
      gm(imgStream, req.files.img.name).resize('480', '480').quality(80).write(writePath , function (err) {
        if (err) {
          console.log('Image upload error: ' + writePath + '\nErr: ' + util.inspect(err));
          return res.redirect(303, '/preferences?up=fail');
        }
        req.session.user.img = writeName;
        db.update({name: req.session.user.name}, {$set: {img: writeName}}, 'users', {}, function (err) {
          if (err) {
            console.log('User profile image update error: ' + util.inspect(err));
            return res.redirect(303, '/preferences?up=fail')
          }
          return res.redirect(303, '/preferences?up=ok');
        });
      });
    }
  },
  {
    path: '/usercontent/:shard/img',
    method: 'POST',
    respond: function (req, res, db) {
      if (typeof req.session.user === 'undefined' || req.session.user.admin !== true) {
        return res.status(403).render('403.hbs', {path: req.originalUrl});
      }
      if (typeof req.files === 'undefined' || typeof req.files.file === 'undefined' || typeof req.params.shard === 'undefined') {
        return res.status(404).render('404.hbs', {path: req.originalUrl});
      }
      var imgStream = fs.createReadStream(req.files.file.path);
      var writeName = req.files.file.name.replace(/\.[a-zA-Z]+$/g, '') + '_' + new Date().getTime() + '.jpg';
      var writePath = process.cwd() + '/usercontent/usercontent/' + req.params.shard + '/';
      gm(imgStream, req.files.file.name).quality(80).write(writePath + writeName, function (err) {
        if (err) {
          console.log('Image upload error: ' + writePath + '\nErr: ' + util.inspect(err));
          return res.status(500).send();
        }
        return res.status(201).send({filename: writeName});
      });
    }
  }
]