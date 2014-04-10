module.exports = [
  {
    path: '/util/generate_204',
    method: 'GET',
    respond: function (req, res, db) {
      res.status(204).send();
    }
  },
  {
    path: '/util/generate_418',
    method: 'GET',
    respond: function (req, res, db) {
      res.status(418).send();
    }
  }
]