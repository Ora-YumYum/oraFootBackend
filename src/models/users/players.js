const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Playerschema = new Schema({


    profile_img: {
        type: String,
        required: false,
    },

    cover_img: {
        type: String,
        required: false,
    },


    bio: {
        type: String,
        required: false,
    },

    wilaya: {
        type: Number,
        required: false,
    },


    main_position: {
        type: Number,
        required: false,
    },


    secondary_position: {
        type: Number,
        required: false,
    },


    application_status: {
        type: Number,
        default : 2,
    },



    followers: [
        {
            type: Schema.Types.ObjectId,
            ref: "Users",
        },
    ],

    following: [
        {
            type: Schema.Types.ObjectId,
            ref: "Users",
        },
    ],


    rating: {
        type: Number,
        required: false,
    },

    ratings: [
        {
            type: Number,

        },
    ],

    goals: [
        {
            type: Object,
        },
    ],

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


});

module.exports = mongoose.model("Players", Playerschema);
