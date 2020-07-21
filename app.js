var createError = require('http-errors');
var express = require('express');
var passport   = require('passport')
var session    = require('express-session')
const SessionStore = require('express-session-sequelize')(session.Store);
var bodyParser = require('body-parser')
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require("dotenv").config()
var Sequelize = require("sequelize");
const sequelize = new Sequelize(`${process.env.DB_TYPE}://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_URL}:${process.env.DB_PORT}/${process.env.DB_DEVELOPMENT_NAME}`);
const Project = sequelize.import("./db/models/project")
const File = sequelize.import("./db/models/file")
const User = sequelize.import("./db/models/user")

const sequelizeSessionStore = new SessionStore({
  db: sequelize,
});

//Relationships
Project.belongsTo(User,{foreignKey:"userid"});
User.hasMany(Project,{foreignKey:"userid"})
File.belongsTo(Project,{foreignKey:"projectfiles",targetKey:"projectID"});
Project.hasMany(File,{foreignKey:"projectfiles",sourceKey:"projectID"})


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');
var projectRouter = require('./routes/project');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'keyboard cat',
  store: sequelizeSessionStore,
  resave: false,
  saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());





app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/project', projectRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
