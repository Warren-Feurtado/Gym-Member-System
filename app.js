 //Specify the Port to listen on
 const port = process.env.PORT || 8383;

var express = require('express');
var path = require('path');

var createError = require('http-errors');

var flash = require('express-flash');
var session = require('express-session');
var cookieParser = require('cookie-parser');

var bodyParser = require('body-parser');

var mysql = require('mysql2');

//Setup External Files
// var connection  = require('./lib/db');

var indexRouter = require('./routes/user');
var adminRouter = require('./routes/admin')
var authRouter = require('./routes/auth');
// var adminRouter = require('./routes/admin');
var usersRouter = require('./routes/user');

var app = express();


 
// Setup the Views Templating Engine
 app.set('views', path.join(__dirname, 'views'));
 app.set('view engine', 'ejs');
 

 app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({ extended: true }));
 app.use(express.static(path.join(__dirname, 'public')));

 
 //Session Settings
 app.use(cookieParser());
 app.use(session({ 
     secret: 'secret code 3245',
     resave: false,
     saveUninitialized: true,
     cookie: { maxAge: 120000 }
 }))
 

 app.use(flash());
 
 app.use('/', indexRouter);
 app.use('/user', usersRouter);
 app.use('/auth', authRouter);
 app.use('/admin', adminRouter);
 
 

 app.listen(port, () => console.log(`Listening on port ${port}..`));

 module.exports = app;