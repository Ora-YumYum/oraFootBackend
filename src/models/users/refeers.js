const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Refeerschema = new Schema({


    profile_img: {
        type: String,
        required: false,
    },

    application_status: {
        type: Number,
        required: false,
        default : 2,
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
});

module.exports = mongoose.model("Refeers", Refeerschema);
