module.exports.s404 = function(req, res, next){
  res.status(404);

  // respond with html page
  if (req.accepts('html')) {
    res.render('404.hbs', { path: req.originalUrl });
    return;
  }

  // respond with json
  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  }

  // default to plain-text. send()
  res.type('txt').send('Not found');
}

module.exports.s500 = function(err, req, res, next){
  res.status(err.status || 500);
  res.render('500.hbs', { path: req.originalUrl, error: err });
}