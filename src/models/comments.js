
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CommentsSchema = new Schema({
    replies: [
        {
            type: Schema.Types.ObjectId,
            ref: "Users",
        },
    ],
    
    likes: [
        {
            type: Schema.Types.ObjectId,
            ref: "Users",
        },
    ],

    video_id: {
        type: String,
        required: true,
    },

    published_by:
    {
        type: Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true,
    },

    comment: {
        type: String,
    },

    date: {
        type: Date,
        default: Date.now(),
    },
});

module.exports = mongoose.model("Comments", CommentsSchema);
