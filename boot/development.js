module.exports = function(app) {
  var path = require('path'),
      logger = require('morgan');


  app.use(logger('dev'));

  require('../app')(app);

  // print stack traces
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });

  // compile sass on the fly (bzzzt)
  app.use(require('node-sass-middleware')({
    src: path.resolve(__dirname, "..", 'public'),
    indentedSyntax: true,
    sourceMap: true
  }));
}
