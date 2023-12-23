

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const LeaguesSchema = new Schema({


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
    required: false,
  },

  start_date: {
    type: Date,
    default: Date.now(),
  },

  end_date: {
    type: Date,
  },

  min_teams_needed: {
    type: Number,
    required: false,
  },

  max_teams_needed: {
    type: Number,
    required: false,
  },


  postedByAdmin: {
    type: Boolean,
    default: false,

  },
  postedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },



  groups: [
    {
      type: Schema.Types.ObjectId,
      ref: "",
    },
  ],

  games: [
    {
      type: Schema.Types.ObjectId,
      ref: "Games",
    },
  ],

  staduims: [
    {
      type: Schema.Types.ObjectId,
      ref: "Staduims",
    },
  ],

  teams: [
    {
      type: Schema.Types.ObjectId,
      ref: "Teams",
    },
  ],

  invitation:
  {
    type: Schema.Types.ObjectId,
    ref: "Invitation",
  },


  league_pre_video: {
    type: String,
  },
  /*team: {
      type: Schema.Types.ObjectId,
      ref: "Teams",
  },*/
});

module.exports = mongoose.model("Leagues", LeaguesSchema);
