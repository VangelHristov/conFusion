'use strict';

let mongoose = require('mongoose'),
	notifier = require('node-notifier');

require('dotenv').config();

let db = mongoose.createConnection(
	process.env.MONGO_URL,
	{promiseLibrary: global.Promise}
);

db.model('Dish', require('./dishes'));
db.model('Promotion', require('./promotions'));
db.model('Leadership', require('./leadership'));
db.model('User', require('./user'));
db.model('Favorite', require('./favorites'));

db.on("error", (err) => notifier.notify({
	"title"  : "ERROR",
	"message": "connection error: " + err
}));

db.once("open", () => notifier.notify({
	"title"  : "SUCCESS",
	"message": "Connected correctly to database"
}));

module.exports = db;
