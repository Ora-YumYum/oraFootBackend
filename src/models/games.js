const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const gamesSchema = new Schema({


    challenge_id: {
        type: Schema.Types.ObjectId,
        ref: "Challanges",
    },

    league_id: {
        type: Schema.Types.ObjectId,
        ref: "Leagues",
    },

    first_team: {
        type: Schema.Types.ObjectId,
        ref: "Teams",
    },

    second_team: {
        type: Schema.Types.ObjectId,
        ref: "Teams",
    },


    first_team_hint: {
        type: String,
       
    },

    second_team_hint: {
        type: String,
    },

    game_id: {
        type: String,
    },

    winner: {
        type: Schema.Types.ObjectId,
        ref: "Teams",
    },

    first_team_score: {
        type: Number,
        default: 0,
    },

    second_team_score: {
        type: Number,
        default: 0,
    },

    games_status: {
        type: Number,
        required: false,
        default: 1,
    },

    game_youtube_video_url: {
        type: String,
        required: false,
    },

    start_date: {
        type: Date,
    },

    start_time: {
        type: Date,
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

    first_team_corners: [
        {
            type: Object,
        },
    ],

    second_team_corners: [
        {
            type: Object,
        },
    ],

    staduim: {
        type: Schema.Types.ObjectId,
        ref: "Staduims",
    },

    refree: {
        type: Schema.Types.ObjectId,
        ref: "Refeers",
    },


});

module.exports = mongoose.model("Games", gamesSchema);
