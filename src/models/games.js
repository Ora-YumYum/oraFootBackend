const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const gamesSchema = new Schema({
    gamesID: {
        type: String,
        required: true,
    },

    first_time: {
        type: Schema.Types.ObjectId,
        ref: "Teams",
    },

    second_time: {
        type: Schema.Types.ObjectId,
        ref: "Teams",
    },


    items: [
        {
            type: Schema.Types.ObjectId,
            ref: "Food",
        },
    ],


    games_status: {
        type: Number,
        required: true,
    },


    game_deatils: {
        type: Object,
    },

    goals: [
        {
            type: Object,
        },
    ],


    fouls: [
        {
            type: Object,z
            
        },
    ],


    cards: [
        {
            type: Object,
        },
    ],
});

module.exports = mongoose.model("Games", gamesSchema);
