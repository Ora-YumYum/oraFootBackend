

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const LeaguesSchema = new Schema({

  title: {
    type: String,
    required: true,
  },


  min_teams_needed: {
    type: Number,
    required: false,
  },

  max_teams_needed: {
    type: Number,
    required: false,
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
  },

  end_date: {
    type: Date,
  },



  isPrivate: {
    type: Boolean,
    default: false,
  },

  postedByAdmin: {
    type: Boolean,
    default: false,
  },

  status: {
    type: Number,
    default: 2,
  },

  postedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },

  games: [
    {
      type: Schema.Types.ObjectId,
      ref: "Games",
    },
  ],

  roundOne:
  {
    type: Schema.Types.ObjectId,
    ref: "Rounds",
  },


  roundTwo:
  {
    type: Schema.Types.ObjectId,
    ref: "Rounds",
  },


  roundThree:
  {
    type: Schema.Types.ObjectId,
    ref: "Rounds",
  },


  final: [
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

  teams_invitation:
  {
    type: Schema.Types.ObjectId,
    ref: "Invitation",
  },

  staduim_invitation:
  {
    type: Schema.Types.ObjectId,
    ref: "Invitation",
  },

  league_pre_video: {
    type: String,
  },
});

module.exports = mongoose.model("Leagues", LeaguesSchema);
