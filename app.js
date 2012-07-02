var express = require('express')
  , http = require('http')
  , moment = require('./lib/moment')
  ;

var app = express();

app.configure(function () {
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  // Provide moment.js for all views
  app.locals({
      formatDate: function (date, format) {
        format = format || 'MMMM Do YYYY';

        return moment(date).format(format);
      }
  });
  // Enable sessions
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'Kayleigh' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function () {
  app.use(express.errorHandler());
});

app.authenticateUser = function (request, response, next) {
  if (request.session.user) {
    next();
  } else {
    response.redirect('/login');
  }
};

require('./routes/admin/index.js')(app);
require('./routes/admin/edit-article.js')(app);
require('./routes/article.js')(app);
require('./routes/index.js')(app);
require('./routes/login.js')(app);
require('./routes/logout.js')(app);
require('./routes/register.js')(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});