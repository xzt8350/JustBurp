var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var validator = require('express-validator');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var hbs = require('hbs');

//db config
var dbConfig = require('./config/db/db');
var initTestData = require('./config/db/testDataInit');
var mongoose = require('mongoose');
// Connect to DB
mongoose.connect(dbConfig.url, function (err) {
  if (err) return console.dir(err);
  initTestData();
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.set('view options', {
  layout: false
});

// register partials
hbs.registerPartials(__dirname + '/views/partials');
hbs.registerHelper('ifCond', function (v1, operator, v2, options) {
  switch (operator) {
    case '==':
      return (v1 == v2) ? options.fn(this) : options.inverse(this);
    case '===':
      return (v1 === v2) ? options.fn(this) : options.inverse(this);
    case '<':
      return (v1 < v2) ? options.fn(this) : options.inverse(this);
    case '<=':
      return (v1 <= v2) ? options.fn(this) : options.inverse(this);
    case '>':
      return (v1 > v2) ? options.fn(this) : options.inverse(this);
    case '>=':
      return (v1 >= v2) ? options.fn(this) : options.inverse(this);
    case '&&':
      return (v1 && v2) ? options.fn(this) : options.inverse(this);
    case '||':
      return (v1 || v2) ? options.fn(this) : options.inverse(this);
    default:
      return options.inverse(this);
  }
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator({
  customValidators: {
    isArray: function (value) {
      return Array.isArray(value);
    },
    isNumberElement: function (value, index) {
      return !isNaN(value[index]);
    }
  }
}));
app.use(cookieParser('secret'));
app.use(express.static(path.join(__dirname, 'public')));


//configure passport and session
var passport = require('passport');
var expressSession = require('express-session');
app.use(expressSession({secret: 'justBurpDJandTracy'}));
app.use(passport.initialize());
app.use(passport.session());

// Using the flash middleware provided by connect-flash to store messages in session
// and displaying in templates
var flash = require('connect-flash');
app.use(flash());

// Initialize Passport
var initPassport = require('./config/passport/init');
initPassport(passport);

// TODO (zhenlily): use XOAuth2 token
var transporter = nodemailer.createTransport(
    smtpTransport('smtps://zhengff41%40gmail.com:YGRDJClily111@smtp.gmail.com')
);
var routes = require('./routes/index')(passport, transporter);
var users = require('./routes/users');
var chef = require('./routes/chef');
//configure passport and session
app.use('/', routes);
app.use('/users', users);
app.use('/chef', chef);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
