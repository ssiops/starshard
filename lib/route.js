function Route (opt) {
  this.path = opt.path;
  this.method = opt.method;
  this.respond = opt.respond;
  return this;
}

Route.prototype.register = function(name, server, db) {
  var self = this;
  if (name.length > 0)
    name = '/' + name;
  if (self.path.length < 1)
    throw 'Invalid route path';
  self.path = name + self.path;
  switch (self.method) {
    case 'GET':
      server.get(self.path, function (req, res) {
        self.respond(req, res, db);
      });
      break;
    case 'POST':
      server.post(self.path, function (req, res) {
        self.respond(req, res, db);
      });
      break;
    case 'PUT':
      server.put(self.path, function (req, res) {
        self.respond(req, res, db);
      });
      break;
    case 'DELETE':
      server.delete(self.path, function (req, res) {
        self.respond(req, res, db);
      });
      break;
    default:
      throw 'Invalid route method';
  }
  return this;
};

module.exports = Route;