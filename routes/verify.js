'use strict';

const jwt = require("jsonwebtoken");

exports.getToken = function getToken(user) {
	return jwt
		.sign(user, process.env.SECRET_KEY, {
			expiresIn: 9999999999
		});
};

exports.userIsAuthenticated = function isAuthenticated(req, res, next) {
	// check header or url parameters or post parameters for token
	let token = req.body.token || req.query.token || req.headers["x-access-token"];
    console.log(token);
	// decode token
	if (token) {
		// verifies secret and checks exp
		jwt.verify(
			token,
			process.env.SECRET_KEY,
			function verifyTokenCallback(err, decoded) {
				if (err) {
					let err = new Error("You are not authenticated!");
					err.status = 401;
					return next(err);
				}
				// if everything is good, save to request for use in
				// other routes
				req.decoded = decoded;
				next();
			}
		);
	} else {
		// if there is no token
		// return an error
		let err = new Error("No token provided!");
		err.status = 403;
		return next(err);
	}
};

exports.userIsAdmin = function isAdmin(req, res, next) {
	if (req.decoded && req.decoded._doc && req.decoded._doc.admin) {
		next();
	} else {
		let err = new Error("You are not authorized to perform this operation!");
		err.status = 403;
		next(err);
	}
};
