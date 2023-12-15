const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const gamesSchema = new Schema({


    challenge_id: {
        type: Schema.Types.ObjectId,
        ref: "Challanges",
    },

    first_team: {
        type: Schema.Types.ObjectId,
        ref: "Teams",
    },

    second_team: {
        type: Schema.Types.ObjectId,
        ref: "Teams",
    },

    first_team_score: {
        type: Number,
        default : 0,
    },

    second_team_score: {
        type: Number,
        default : 0,
    },

    games_status: {
        type: Number,
        required: false,
        default : 1,
    },

    game_youtube_video_url: {
        type: String,
        required: false,
    },

    game_deatils: {
        type: Object,
    },

    first_team_goals: [
        {
            type: Object,
        },
    ],

    second_team_goals: [
        {
            type: Object,
        },
    ],

    first_team_fouls: [
        {
            type: Object,

        },
    ],

    second_team_fouls: [
        {
            type: Object,

        },
    ],
    
    first_team_cards: [
        {
            type: Object,
        },
    ],

    second_team_cards: [
        {
            type: Object,
        },
    ],

});

module.exports = mongoose.model("Games", gamesSchema);
