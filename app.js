'use strict';

const express = require("express"),
	path = require("path"),
	logger = require("morgan"),
	cookieParser = require("cookie-parser"),
	bodyParser = require("body-parser"),
	passport = require("passport"),
	router = require("./routes/index");

// create connection for the database
require('./models/db');

const
	{Strategy} = require("passport-local"),
	User = require("./models/db")
		.model('User');

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new Strategy({}, User.authenticate()));

const app = express();

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(passport.initialize());
app.use(express.static(path.join(__dirname, "public")));
app.use('/bower_components',  express.static(__dirname + '/public/bower_components'));

app.get("/", (req, res) => res.sendFile('public/index.html'));
app.use("/api/users", router.users);
app.use("/api/dishes", router.dishes);
app.use("/api/promotions", router.promotions);
app.use("/api/leadership", router.leadership);
app.use("/api/favorites", router.favorites);

// catch 404 and forward to error handler
app.use(function catch404(req, res, next) {
	let err = new Error("Not Found");
	err.status = 404;
	next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (app.get("env") === "development") {
	app.use(function logError(err, req, res) {
		res.status(err.status || 500);
		res.json({
			message: err.message,
			error  : err
		});
	});
}

// production error handler
// no stacktrace leaked to user
app.use(function errorHandler(err, req, res) {
	res.status(err.status || 500);
	res.json({
		message: err.message,
		error  : {}
	});
});

module.exports = app;
