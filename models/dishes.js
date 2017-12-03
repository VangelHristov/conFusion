let mongoose = require("mongoose"),
	Schema = mongoose.Schema;

require("mongoose-currency")
	.loadType(mongoose);

let Currency = mongoose.Types.Currency,
	commentSchema = new Schema(
		{
			rating  : {
				type    : Number,
				min     : 1,
				max     : 5,
				required: true
			},
			comment : {
				type    : String,
				required: true
			},
			postedBy: {
				type: mongoose.Schema.Types.ObjectId,
				ref : "User"
			},
			author  : {
				type    : String,
				required: true
			}
		},
		{
			timestamps: true
		}
	);

module.exports = new Schema(
	{
		name       : {
			type   : String,
			require: true,
			unique : true
		},
		description: {
			type    : String,
			required: true
		},
		image      : {
			type    : String,
			required: true
		},
		category   : {
			type    : String,
			required: true
		},
		label      : {
			type   : String,
			default: ""
		},
		price      : {
			type    : Currency,
			required: true
		},
		comments   : [commentSchema]
	},
	{
		timestamps: true
	}
);
