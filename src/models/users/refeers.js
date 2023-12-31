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

    wilaya: {
        type: Number,
        required: false,
    },

    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
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

    followers: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    
      following: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    
      posts: [
        {
          type: Schema.Types.ObjectId,
          ref: "Posts",
        },
      ],
});

module.exports = mongoose.model("Refeers", Refeerschema);
