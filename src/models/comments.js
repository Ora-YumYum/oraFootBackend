
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CommentsSchema = new Schema({
    replies: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    
    likes: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    ],

    video_id: {
        type: String,
        required: false,
    },

    published_by:
    {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: false,
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
