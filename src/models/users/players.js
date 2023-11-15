const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Playerschema = new Schema({


    profile_img: {
        type: String,
        required: true,
    },

    cover_img: {
        type: String,
        required: true,
    },


    bio: {
        type: String,
        required: true,
    },


    main_position: {
        type: Number,
        required: true,
    },


    secondary_position: {
        type: Number,
        required: true,
    },


    application_status: {
        type: Number,
        required: true,
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
        required: true,
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
