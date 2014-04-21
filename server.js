'use strict';

var t = new Date();

var pkg = require('./package.json');

var assert = require('assert');
var async = require('async');

var cluster = require('cluster');
var express = require('express');
var redis = require('redis');

var logger = require('morgan');
var compress = require('compression');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var serveStatic = require('serve-static');
var methodOverride = require('method-override');
var connectRedis = require('connect-redis');
var multiparty = require('connect-multiparty');
var errorHandler = require('errorhandler');

var redisClient = redis.createClient();
var RedisStore = require('connect-redis')(session);

var init = require('./lib/init.js');
var view = require('./lib/view.js');
var error = require('./lib/error.js');

if (cluster.isMaster) {
  // Fork workers.
  console.log('[%s]\nSystem started. Initializing system clusters.', t);
  for (var i = 0; i < require('os').cpus().length; i++) {
    cluster.fork();
  }
  cluster.on('exit', function(worker, code, signal) {
    console.log('worker ' + worker.process.pid + ' died');
  });
} else {
  var server = module.exports = express();

  server.set('env', pkg.production == true ? 'production': 'development');
  if (pkg.production !== true)
    server.use(logger('dev'));
  server.use(compress());
  server.use(bodyParser());
  server.use(multiparty({limit: '8mb'}));
  server.use(cookieParser());
  server.use(session({store: new RedisStore({client: redisClient}), secret: 'SSIv4'}));
  server.use(serveStatic(__dirname + '/_static'));
  server.use(serveStatic(__dirname + '/usercontent'));
  server.use(methodOverride());

  server.engine('html', view.__express);
  server.set('view engine', 'html');
  server.set('views', __dirname + '/views');

  server.use(errorHandler({ dumpExceptions: true, showStack: true }));

  init(server, function (err) {
    assert.equal(null, err);
    server.use(error.s404);
    server.use(error.s500);
    server.listen(80, function(){
      console.log('Cluster #%d booted in %d ms. [@port %d in %s mode]', cluster.worker.id, new Date().getTime() - t.getTime(), 80, server.settings.env);
    });
  });
}