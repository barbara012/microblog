
/**
 * Module dependencies.
 */

var express = require('express')
	,	engine = require('ejs-locals')
  , MongoStore = require('connect-mongo')(express)
  , settings = require('./settings')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , flash = require('connect-flash');

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
  app.use(express.session({
    secret: settings.cookieSecret,
    store: new MongoStore({
      db: settings.db
    })
  }));
  app.use(flash());
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(function(req, res, next){
    res.locals.user = req.session.user;
    console.log(res.locals);
    var err = req.flash('error')
    res.locals.error = err.length?err:null;
    var success = req.flash('success');
    res.locals.success = success.length?success:null;
    next();
  });
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler());
});
routes(app);
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'), app.settings.env);
});
