'use strict';

const {Router} = require("express"),
	passport = require("passport"),
	db = require("../models/db"),
	verify = require("./verify");

const userRouter = Router(),
	User = db.model('User');

const loginUser = function (req, res, user) {
	req.logIn(user, function loginUser(err) {
		if (err) {
			return res.status(400)
			          .json("Could not log in user");
		}

		let token = verify.getToken(user);
		res.status(200)
		   .json({
			   message: "Login successful!",
			   success: true,
			   userId : user._id,
			   name   : user.username,
			   token  : token
		   });
	});
};

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
		let username = req.body.username;
		let password = req.body.password;

		User.register(
			{username: username},
			password,
			function registerCallback(err, user) {
				if (err) {
					return res
						.status(400)
						.json(err);
				}

				if (!user) {
					return res
						.status(400)
						.json('Unable to register');
				}

				loginUser(req, res, user);
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
						.json(info);
				}
				loginUser(req, res, user);
			}
		)(req, res, next);
	}
);

userRouter.get(
	"/logout",
	function logoutUser(req, res) {
		req.logout();
		res.json("Logout successful!");
	}
);

module.exports = userRouter;
