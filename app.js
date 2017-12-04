'use strict';

require('domain');

const express = require("express"),
	path = require("path"),
	logger = require("morgan"),
	bodyParser = require("body-parser"),
	passport = require("passport"),
	session = require("express-session"),
	router = require("./routes/index"),
	compression = require('compression'),
	helmet = require('helmet'),
	favicon = require('express-favicon');

const db = require('./models/db');
const User = db.model('User');

//initialize passport
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const app = express();

app.set('etag', 'weak');

// helmet contentSecurityPolicy prevents browserSync from syncing browser
if (process.env.NODE_ENV.toString() === 'production') {
	app.use(
		helmet({
			contentSecurityPolicy: {
				directives: {
					defaultSrc: ["'self'"]
				}
			},
			hidePoweredBy        : {
				setTo: 'PHP 4.2.0'
			}
		})
	);
}

app.use(favicon(__dirname + 'favicon.ico'));
app.use(compression());
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//need this according to passport guide
app.use(session({
	secret           : process.env.SESSION_SECRET,
	saveUninitialized: false,
	resave           : false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, process.env.STATIC_FILES)));

app.get(
	"/",
	(req, res) => {
		res.sendFile(`./${process.env.STATIC_FILES}/index.html`);
	}
);
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
