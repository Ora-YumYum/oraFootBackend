const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const gamesSchema = new Schema({


    gamesID: {
        type: String,
        required: true,
    },

    first_team: {
        type: Schema.Types.ObjectId,
        ref: "Teams",
    },

    second_team: {
        type: Schema.Types.ObjectId,
        ref: "Teams",
    },


    games_status: {
        type: Number,
        required: true,
    },

    game_youtube_video_url: {
        type: String,
        required: false,
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
            type: Object,

        },
    ],


    cards: [
        {
            type: Object,
        },
    ],
});

module.exports = mongoose.model("Games", gamesSchema);
