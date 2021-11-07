require("dotenv").config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
// const pgp = require('pg-promise')();
const passport = require("./modules/passport");

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const classroomRouter = require('./api/classes');
const registerRouter = require('./api/auth');
const authRouter = require('./api/authenticate');

const app = express();
app.use(passport.initialize());
const cors = require("cors");

const allowedOrigins = ["http://localhost:3000", "http://yourapp.com"];

// const db = pgp("postgres://postgres:123123@localhost:5432/ex_week_04");
// db.query('SELECT topic AS value FROM classroom')
//   .then(function (data) {
//     console.log('DATA:', data)
//   })
//   .catch(function (error) {
//     console.log('ERROR:', error)
//   })

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/classroom",passport.authenticate('jwt',{session:false}), classroomRouter);
app.use("/auth", authRouter);
app.use('/register',registerRouter)
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
