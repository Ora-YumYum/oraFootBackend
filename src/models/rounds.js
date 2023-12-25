const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const RoundsSchema = new Schema({


    round: {
        type: Number,
        required: true,
    },

    teams: [
       
    ],

    games: [
        {
            type: Schema.Types.ObjectId,
            ref: "Games",
            required : false
        },

    ],

    winners: [
        {
            type: Schema.Types.ObjectId,
            ref: "Teams",
        },
    ],

    published_by:
    {
        type: Schema.Types.ObjectId,
        ref: "User",

    },
});

module.exports = mongoose.model("Rounds", RoundsSchema);
