

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const GamesSchema = new Schema({


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


  location: {
    type: String,
    required: true,
  },

  start_date: {
    type: Date,
    default: Date.now(),
  },


  match_type: {
    type: Number,
    required: true,
  },


  numbers_of_players: {
    type: Number,
    required: false,
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

  chooseGender: {
    type: Number,
    default: false,
  },


  ageGroup: {
    type: {},
  },

  league_pre_video: {
    type: String,
  },


  applications: [
    {
      type: Object,
    },
  ],

  league_status: {
    type: Number,
    default: 2,
  },


  /*team: {
      type: Schema.Types.ObjectId,
      ref: "Teams",
  },*/
});

module.exports = mongoose.model("Games", GamesSchema);
