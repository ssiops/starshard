var util = require('util');
var fs = require('fs');
var gm = require('gm');

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
      if (typeof req.files.img === 'undefined') {
        return res.status(404).render('404.hbs', {path: req.originalUrl});
      }
      if (typeof req.files.img.size > 2000000) {
        return res.status(413).render('error.hbs', {code: 413, msg: 'Your image is too large.'});
      }
      var imgStream = fs.createReadStream(req.files.img.path);
      var writeName = req.session.user.name + '_' + new Date().getTime() + '.jpg';
      var writePath = process.cwd() + '/usercontent/usercontent/profile/' + writeName;
      gm(imgStream, req.files.img.name).resize('480', '480').quality(80).write(writePath , function (err) {
        if (err) {
          console.log('Image upload error: ' + writePath + '\nErr: ' + util.inspect(err));
          return res.redirect(303, '/preferences?up=fail')
        }
        return res.redirect(303, '/preferences?up=ok');
      });
    }
  }
]