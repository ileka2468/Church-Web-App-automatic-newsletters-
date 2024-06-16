const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const session = require('express-session');
const mysql = require('mysql');

const indexRouter = require('./routes/index');
const galleryRouter = require('./routes/gallery');
const contactRouter = require('./routes/contact');
const missionRouter = require('./routes/mission');
const unsubscribeRouter = require('./routes/unsubscribe');
const donateRouter = require('./routes/donate');
const servicesRouter = require('./routes/services');
const readingsRouter = require('./routes/readings')

const app = express();
app.locals.is_production = app.get('env');
app.locals.is_production == "development" ? require('dotenv').config() :

// const pool = mysql.createPool({
//   host: process.env.HOST,
//   database: process.env.DATABASE,
//   user: process.env.USER,
//   password: process.env.PASSWORD
// });

// app.use((req, res, next) => {
//   req.pool = pool;
//   next();
// });


app.use(session({
  secret: "fixlata",
  cookie: { maxAge: 60 * 60 * 1000 },
  saveUninitialized: false,
  resave: false
}))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
// app.use('/gallery', galleryRouter);
app.use('/contact', contactRouter);
app.use('/mission', missionRouter);
app.use('/unsubscribe', unsubscribeRouter);
app.use('/donate', donateRouter);
app.use('/services', servicesRouter);
// app.use('/readings', readingsRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  console.log(err);
  res.render('error');
});

module.exports = app;
