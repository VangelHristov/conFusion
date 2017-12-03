let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let passportLocalMongoose = require("passport-local-mongoose");

let userSchema = new Schema({
	username: {
		type    : String,
		required: true
	},
	admin   : {
		type   : Boolean,
		default: false
	}
});

userSchema.plugin(passportLocalMongoose, {
	interval     : 10000,
	loginAttempts: true,
	maxAttempts  : 5
});

module.exports = userSchema;
