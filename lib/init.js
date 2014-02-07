var Route = require('./route.js');

var initShards = function (server) {
  var shards = require('../shards.json').list;
  server.shards = {};
  for (var i = 0; i < shards.length; i++) {
    var shard = require(shards[i]);
    // TODO: init shard db
    server.shards[shard.name] = shard;
    for (var j = 0; j < shard.routes.length; j++) {
      var route = new Route(shard.routes[j]);
      route.register(shard.name, server, shard.db);
    }
  }
}

var initDB = function (server) {
  // TODO: Database init
}

module.exports = function (server) {
  initDB(server);
  initShards(server);
};