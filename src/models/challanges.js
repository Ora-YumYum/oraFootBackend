

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const challangesSchema = new Schema({


    title: {
        type: String,
        required: true,
    },


    cover_img: {
        type: String,
        required: false,
    },


    desc: {
        type: String,
        required: true,
    },

    staduim: {
        type: Schema.Types.ObjectId,
        ref: "Staduims",
    },

    start_date: {
        type: Date,
    },

    start_time: {
        type: Date,
    },


    match_type: {
        type: Number,
        required: true,
    },


    numbers_of_players: {
        type: Number,
        required: true,
    },


    field_type: {
        type: Number,
        required: true,
    },

    price: {
        type: Number,
        required: true,
    },


    payment_method: {
        type: Number,
    },


    isPrivateGame: {
        type: Boolean,
        default: false,
    },


    notifyPhotographer: {
        type: Boolean,
        default: false,
    },


    notifyRefree: {
        type: Boolean,
        default: false,
    },


    pinnedGame: {
        type: Boolean,
        default: false,
    },

    postedByAdmin: {
        type: Boolean,
        default: false,

    },

    isActive: {
        type: Boolean,
        default: false,

    },

    status: {
        type: Number,
        default: 1,
    },

    postedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },

    team: {
        type: Schema.Types.ObjectId,
        ref: "Teams",
    },



    opponent_team: {
        type: Schema.Types.ObjectId,
        ref: "Teams",
    },

    opponent_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },

    invitation: {
        type: Schema.Types.ObjectId,
        ref: "Invitation",
    },


    refree_invitation: {
        type: Schema.Types.ObjectId,
        ref: "Invitation",
    },

    photographer_invitation: {
        type: Schema.Types.ObjectId,
        ref: "Invitation",
    },

    staduim_invitation: {
        type: Schema.Types.ObjectId,
        ref: "Invitation",
    },

    game: {
        type: Schema.Types.ObjectId,
        ref: "Games",
    },

    ageGroup: {
        type: {},
    },


    /*team: {
        type: Schema.Types.ObjectId,
        ref: "Teams",
    },*/
});

module.exports = mongoose.model("Challanges", challangesSchema);
