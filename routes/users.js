'use strict';

const {Router} = require("express"),
	passport = require("passport"),
	db = require("../models/db"),
	verify = require("./verify");

const userRouter = Router(),
	User = db.model('User');

userRouter.get(
	"/",
	verify.userIsAuthenticated,
	verify.userIsAdmin,
	function getUsers(req, res, next) {
		User.find({})
		    .then(users => res.json(users))
		    .catch(err => next(err));
	}
);

userRouter.post(
	"/register",
	function postUser(req, res) {
		User.register(
			new User({username: req.body.username}),
			req.body.password,
			function registerCallback(err, user) {
				if (err) {
					return res
						.status(400)
						.json({err: err});
				}

				if (req.body.firstname) {
					user.firstname = req.body.firstname;
				}

				if (req.body.lastname) {
					user.lastname = req.body.lastname;
				}

				user.save(function saveCallback(err) {
					if (err) {
						return res
							.status(400)
							.json(err.message);
					}
					passport.authenticate("local")(
						req,
						res,
						function authenticationCallback() {
							return res
								.status(201);
						}
					);
				});
			}
		);
	}
);

userRouter.post(
	"/login",
	function postUser(req, res, next) {
		passport.authenticate(
			"local",
			function authenticationCallback(err, user, info) {
				if (err) {
					return next(err);
				}
				if (!user) {
					return res
						.status(401)
						.json({
							err: info
						});
				}

				req.logIn(user, function loginUser(err) {
					if (err) {
						return res.status(400)
						          .json({
							          err: "Could not log in user"
						          });
					}

					let token = verify.getToken(user);
					res.status(200)
					   .json({
						   status : "Login successful!",
						   success: true,
						   userId : user._id,
						   name   : user.username,
						   token  : token
					   });
				});
			}
		)(req, res, next);
	}
);

userRouter.get(
	"/logout",
	function logoutUser(req, res) {
		req.logout();
		res.json({
			status: "Logout successful!"
		});
	}
);

module.exports = userRouter;
