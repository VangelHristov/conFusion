'use strict';

const {Router} = require("express"),
	bodyParser = require("body-parser"),
	verify = require("./verify"),
	db = require("../models/db");

const Promotions = db.model('Promotion'),
	promoRouter = Router();

promoRouter.use(bodyParser.json());

promoRouter
	.route("/")
	.get((req, res, next) => {
		Promotions.find({})
		          .then(promotions => res.json(promotions))
		          .catch(err => next(err));
	})
	.post(
		verify.userIsAuthenticated,
		verify.userIsAdmin,
		(req, res, next) => {
			Promotions.create(req.body)
			          .then(promotion => res.status(201)
			                                .json({_id: promotion._id}))
			          .catch(err => next(err));
		}
	)
	.delete(
		verify.userIsAuthenticated,
		verify.userIsAdmin,
		(req, res, next) => {
			Promotions.remove({})
			          .then(result => res.json(result))
			          .catch(err => next(err));
		}
	);

promoRouter
	.route("/:promotionId")
	.get((req, res, next) => {
		Promotions.findById(req.params.promotionId)
		          .then(promotion => res.json(promotion))
		          .catch(err => next(err));
	})
	.put(
		verify.userIsAuthenticated,
		verify.userIsAdmin,
		(req, res, next) => {
			let
				id = req.params.promotionId,
				options = {$set: req.body},
				returnNew = {new: true};

			Promotions.findByIdAndUpdate(id, options, returnNew)
			          .then(promotion => res.json(promotion))
			          .catch(err => next(err));
		}
	)
	.delete(
		verify.userIsAuthenticated,
		verify.userIsAdmin,
		(req, res, next) => {
			Promotions.findByIdAndRemove(req.params.promotionId)
			          .then(resp => res.status(204)
			                           .json(resp))
			          .catch(err => next(err));
		}
	);

module.exports = promoRouter;
