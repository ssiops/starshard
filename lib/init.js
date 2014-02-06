var initShards = function (server) {
  var shards = require('./shards');
  server.shards = []
  for (var i = 0; i < shards.length; i++) {
    server.shards.push(require(shards[i]));
    for (var j = 0; j < server.shards[i].routes.length; j++) {
      // TODO: register the routes
    }
  }
}

var initDB = function (server) {
  // TODO: Database init
}

module.exports = function (server) {
  
};