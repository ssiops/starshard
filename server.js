'use strict';

var pkg = require('./package.json');

var assert = require('assert');
var async = require('async');

var express = require('express');
var redis = require('redis');
var redisClient = redis.createClient();
var RedisStore = require('connect-redis')(express);
var init = require('./lib/init.js');

console.log('[%s]\nSystem started. Initializing system parameters.', new Date());

var server = module.exports = express();

server.configure(function () {
  server.set('env', pkg.production == true ? 'production': 'development');
  server.use(express.logger('dev'));
  server.use(express.compress());
  server.use(express.bodyParser());
  server.use(express.cookieParser());
  server.use(express.session({store: new RedisStore({client: redisClient}), secret: 'SSIv4'}));
  server.use(express.static(__dirname + '/_static'));
  server.use(express.methodOverride());
});

server.configure('development', function(){
  server.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

server.configure('production', function(){
  server.use(express.errorHandler());
});

init(server, function (err) {
  assert.equal(null, err);
  server.listen(80, function(){
    console.log("SFEI Systems operating on port %d in %s mode. [%s]", 80, server.settings.env, new Date());
  });
});