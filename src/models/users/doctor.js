const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Doctorschema = new Schema({


    profile_img: {
        type: String,
        required: true,
    },

    application_status: {
        type: Number,
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
    challanges: [
        {
            type: Schema.Types.ObjectId,
            ref: "Challanges",
        },
    ],
});

module.exports = mongoose.model("Doctors", Doctorschema);
