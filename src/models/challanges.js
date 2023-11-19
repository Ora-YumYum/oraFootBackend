

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const challangesSchema = new Schema({


    title: {
        type: String,
        required: true,
    },


    cover_img: {
        type: String,
        required: false,
    },


    desc: {
        type: String,
        required: true,
    },


    location: {
        type: String,
        required: true,
    },

    start_date: {
        type: Date,
        default: Date.now(),
    },


    match_type: {
        type: String,
        required: true,
    },


    numbers_of_players: {
        type: Number,
        required: false,
    },


    price: {
        type: Number,
        required: true,
    },


    payment_method: {
        type: Number,
    },


    isPrivateGame: {
        type: Boolean,
        default: false,
    },


    notifyPhotographer: {
        type: Boolean,
        default: false,
    },


    notifyRefree: {
        type: Boolean,
        default: false,
    },


    pinnedGame: {
        type: Boolean,
        default: false,
    },

    postedByAdmin: {
        type: Boolean,
        default: false,

    },
    isActive: {
        type: Boolean,
        default: false,

    },

    postedBy: {
        type: Schema.Types.ObjectId,
        ref: "Users",
    },

    ageGroup: {
        type: {},
    },

    /*team: {
        type: Schema.Types.ObjectId,
        ref: "Teams",
    },*/
});

module.exports = mongoose.model("Challanges", challangesSchema);
