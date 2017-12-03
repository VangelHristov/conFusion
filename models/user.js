let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let passportLocalMongoose = require("passport-local-mongoose");

let userSchema = new Schema({
    userSchemaname: String,
    password: String,
    OauthId: String,
    OauthToken: String,
    firstname: {
        type: String,
        default: ""
    },
    lastname: {
        type: String,
        default: ""
    },
    admin: {
        type: Boolean,
        default: false
    }
});

userSchema.methods.getName = function () {
    return this.firstname + " " + this.lastname;
};

userSchema.plugin(passportLocalMongoose);

module.exports = userSchema;
