let mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    objectId = mongoose.Schema.Types.ObjectId;

module.exports = new Schema(
    {
        postedBy: {
            type: objectId,
            required: true,
            ref: "User"
        },
        dishes: [
            {
                type: objectId,
                ref: "Dish"
            }
        ]
    },
    { timestamps: true }
);
