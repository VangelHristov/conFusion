'use strict';

const
	{Router} = require('express'),
	verify = require("./verify"),
	bodyParser = require("body-parser"),
	db = require("../models/db");

const favoriteRouter = Router(),
	Favorites = db.model('Favorite');

favoriteRouter.use(bodyParser.json());

favoriteRouter
	.route("/")
	.get(
        verify.userIsAuthenticated,
        (req, res, next) => {
	    	Favorites.findOne({postedBy: req.decoded._doc._id})
		         .populate("postedBy dishes")
		         .then(favorites => res.json(favorites))
		         .catch(err => next(err));
	})
	.post(
		verify.userIsAuthenticated,
		function postFavorite(req, res, next) {
			let query = {postedBy: req.decoded._doc._id},
				update = {$addToSet: {dishes: req.body.id}},
				options = {upsert: true, new: true};

			Favorites.findOneAndUpdate(query, update, options)
			         .then(favorites => res.json(favorites))
			         .catch(err => next(err));
		}
	)
	.delete(
		verify.userIsAuthenticated,
		(req, res, next) => {
			Favorites.remove({postedBy: req.decoded._doc._id})
			         .then(result => res.json(result))
			         .catch(err => next(err));
		}
	);

favoriteRouter
	.route("/:dishId")
	.delete(
		verify.userIsAuthenticated,
		(req, res, next) => {
			let query = {postedBy: req.decoded._doc._id},
				update = {$pull: {dishes: req.params.dishId}};

			Favorites.findOneAndUpdate(query, update)
			         .then(favorites => res.json(favorites))
			         .catch(err => next(err));
		}
	);

module.exports = favoriteRouter;
