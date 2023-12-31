const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Photographerschema = new Schema({


    profile_img: {
        type: String,
        required: true,
    },


    application_status: {
        type: Number,
        default: 2,
        required: false,
    },

    wilaya: {
        type: Number,
        required: false,
    },

    games: [
        {
            type: Schema.Types.ObjectId,
            ref: "Games",
        },
    ],
    leagues: [
        {
            type: Schema.Types.ObjectId,
            ref: "Leagues",
        },
    ],
    challanges: [
        {
            type: Schema.Types.ObjectId,
            ref: "Challanges",
        },
    ],

    followers: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    ],

    following: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    ],

    posts: [
        {
            type: Schema.Types.ObjectId,
            ref: "Posts",
        },
    ],
});

module.exports = mongoose.model("Photographers", Photographerschema);
