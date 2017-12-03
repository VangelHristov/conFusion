'use strict';

const
	{Router} = require("express"),
	bodyParser = require("body-parser"),
	verify = require("./verify"),
	db = require("../models/db");

const
	Leaders = db.model('Leadership'),
	leaderRouter = Router();

leaderRouter.use(bodyParser.json());

leaderRouter
	.route("/")
	.get((req, res, next) => {
		Leaders.find({})
		       .then(leaders => res.json(leaders))
		       .catch(err => next(err));
	})
	.post(
		verify.userIsAuthenticated,
		verify.userIsAdmin,
		(req, res, next) => {
			Leaders.create(req.body)
			       .then(leader => res.status(201)
			                          .json({_id: leader._id}))
			       .catch(err => next(err));
		}
	)
	.delete(
		verify.userIsAuthenticated,
		verify.userIsAdmin,
		(req, res, next) => {
			Leaders.remove({})
			       .then(leader => res.status(204)
			                          .json(leader))
			       .catch(err => next(err));
		}
	);

leaderRouter
	.route("/:leadershipId")
	.get((req, res, next) => {
		Leaders
			.findById(req.params.leadershipId)
			.then(leader => res.json(leader))
			.catch(err => next(err));
	})
	.put(
		verify.userIsAuthenticated,
		verify.userIsAdmin,
		(req, res, next) => {
			let
				id = req.params.leaderId,
				options = {$set: req.body},
				returnNew = {new: true};

			Leaders
				.findByIdAndUpdate(id, options, returnNew)
				.then(leader => res.json(leader))
				.catch(err => next(err));
		}
	)
	.delete(
		verify.userIsAuthenticated,
		verify.userIsAdmin,
		(req, res, next) => {
			Leaders
				.findByIdAndRemove(req.params.leaderId)
				.then(leader => res.status(204)
				                   .json(leader))
				.catch(err => next(err));
		}
	);

module.exports = leaderRouter;
