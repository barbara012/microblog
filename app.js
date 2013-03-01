
/**
 * Module dependencies.
 */

var express = require('express')
	,	engine = require('ejs-locals')
  , MongoStore = require('connect-mongo')
  , settings = require('./settings')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();
app.engine('ejs', engine);
app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
/*  app.use(express.session({
    secret: settings.cookieSecret,
    Store: new MongoStore({
      db: settings.db
    })
  }));*/
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});
routes(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'), app.settings.env);
});
