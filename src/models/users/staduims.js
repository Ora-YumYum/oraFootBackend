const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Teamschema = new Schema({

    staduim_id: {
        type: String,
        required: false,
    },

    staduim_name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    price_per_hour: {
        type: Number,
        required: false,
    },
    price_per_month: {
        type: Number,
        required: false,
    },
    price_per_year: {
        type: Number,
        required: false,
    },
    phone_number: {
        type: String,
        required: true,
    },
    staduim_img: {
        type: String,
        required: true,
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

});

module.exports = mongoose.model("Teams", Teamschema);
