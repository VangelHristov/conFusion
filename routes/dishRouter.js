'use strict';

const {Router} = require("express"),
	bodyParser = require("body-parser"),
	verify = require("./verify"),
	db = require('../models/db');

const dishRouter = Router(),
	Dishes = db.model('Dish');

dishRouter.use(bodyParser.json());

dishRouter
	.route("/")
	.get((req, res, next) => {
		Dishes.find({})
		      .populate("comments.postedBy")
		      .then(dish => res.json(dish))
		      .catch(err => next(err));
	})
	.post(
		verify.userIsAuthenticated,
		verify.userIsAdmin,
		(req, res, next) => {
			Dishes.create(req.body)
			      .then(dish => res.status(201)
			                       .json(dish))
			      .catch(err => next(err));
		}
	)
	.delete(
		verify.userIsAuthenticated,
		verify.userIsAdmin,
		(req, res, next) => {
			Dishes.remove({})
			      .then(dish => res.json(dish))
			      .catch(err => next(err));
		}
	);

dishRouter
	.route("/:dishId")
	.get((req, res, next) => {
		Dishes.findById(req.params.dishId)
		      .populate("comments.postedBy")
		      .then(dish => res.json(dish))
		      .catch(err => next(err));
	})
	.put(
		verify.userIsAuthenticated,
		verify.userIsAdmin,
		(req, res, next) => {
			let update = {$set: req.body},
				options = {new: true};

			Dishes.findByIdAndUpdate(req.params.dishId, update, options)
			      .then(dish => res.json(dish))
			      .catch(err => next(err));
		}
	)
	.delete(
		verify.userIsAuthenticated,
		verify.userIsAdmin,
		(req, res, next) => {
			Dishes.findByIdAndRemove(req.params.dishId)
			      .then(dish => res.json(dish))
			      .catch(err => next(err));
		}
	);

dishRouter
	.route("/:dishId/comments")
	.get((req, res, next) => {
		Dishes.findById(req.params.dishId)
		      .populate("comments.postedBy")
		      .then(dish => res.json(dish.comments))
		      .catch(err => next(err));
	})
	.post(
		verify.userIsAuthenticated,
		(req, res, next) => {
			req.body.postedBy = req.decoded._doc._id;

			Dishes.findByIdAndUpdate(
				req.params.dishId,
				{$push: {comments: req.body}},
				{new: true}
			      )
			      .then(dish => res.json(dish))
			      .catch(err => next(err));
		}
	)
	.delete(
		[verify.userIsAuthenticated, verify.userIsAdmin],
		(req, res, next) => {
			Dishes.findByIdAndUpdate(
				req.params.dishId,
				{$unset: {comments: []}},
				{new: true}
			      )
			      .then(dish => res.json(dish))
			      .catch(err => next(err));
		}
	);

dishRouter
	.route("/:dishId/comments/:commentId")
	.get((req, res, next) => {
		Dishes.findById(req.params.dishId)
		      .populate("comments.postedBy")
		      .then(
			      dish => res.json(dish.comments.id(req.params.commentId)))
		      .catch(err => next(err));
	})
	.put(
		verify.userIsAuthenticated,
		(req, res, next) => {

			function getArrayFieldsToUpdate(source, prefix) {
				let fieldsToUpdate = Object.keys(source),
					updateObj = {};

				fieldsToUpdate.forEach(
					function updateFields(field) {
						updateObj[`${prefix}.${field}`] = source[field];
					});

				return updateObj;
			}

			let query = {
					_id           : req.params.dishId,
					'comments._id': req.params.commentId
				},
				update = {
					$set: getArrayFieldsToUpdate(
						req.body,
						'comments.$'
					)
				},
				options = {new: true};

			Dishes.findOneAndUpdate(query, update, options)
			      .then(doc => res.json(doc))
			      .catch(err => next(err));
		}
	)
	.delete(
		verify.userIsAuthenticated,
		(req, res, next) => {
			// Cant't figure out a way to return not authorized if the
			// comment.postedBy !== req.decoded._doc._id so commenting out
			// this solution

			// let update = {
			//     $pull: { comments: { _id: req.params.commentId, postedBy:
			// req.decoded._doc._id } } }, options = { new: true };

			// Dishes.findById(req.params.dishId, update, options)
			//     .then(dish => res.json(dish))
			//     .catch(err => next(err));

			Dishes.findById(req.params.dishId)
			      .then(dish => {
				      let comment = dish.comments.id(req.params.commentId);
				      if (comment && comment.postedBy === req.decoded._doc._id) {
					      dish.comments.remove(comment);
					      return dish.save();
				      }

				      let err = Error(
					      "You are not authorized to perform this operation.");
				      err.status = 403;
				      throw err;
			      })
			      .then(dish => res.json(dish))
			      .catch(err => next(err));
		}
	);

module.exports = dishRouter;
