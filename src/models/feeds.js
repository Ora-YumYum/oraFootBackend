const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const FeedsSchema = new Schema({
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: "Food",
        },
    ],
    likes: [
        {
            type: Schema.Types.ObjectId,
            ref: "Users",
        },
    ],
    shares: [
        {
            type: Schema.Types.ObjectId,
            ref: "Users",
        },
    ],
    video_url: {
        type: String,
        required: true,
    },
    published_by:
    {
        type: Schema.Types.ObjectId,
        ref: "Restaurant",

    },
    description: {
        type: String,
    },
    published_date: {
        type: Date,
        default : Date.now(),
    },
});

module.exports = mongoose.model("Feeds", FeedsSchema);
