var hbs = require('hbs');

hbs.registerPartials('./views/partials');

hbs.registerHelper('parse', function (data, opt) {
  return opt.fn(JSON.parse(data));
});

module.exports = hbs;