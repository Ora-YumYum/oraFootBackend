const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Teamschema = new Schema({

  team_name: {
    type: String,
    required: true,
  },

  profile_img: {
    type: String,
    required: false,
  },

  cover_img: {
    type: String,
    required: false,
  },


  about: {
    type: String,
    required: true,
  },

  address: {
    type: String,
    required: true,
  },


  players: [
    {
      type: Schema.Types.ObjectId,
      ref: "Players",
    },
  ],


  doctor: {
    type: Schema.Types.ObjectId,
    ref: "Doctors",
  },


  main_color: {
    type: String,
    required: true,
  },

  secondary_color: {
    type: String,
    required: true,
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
      ref: "Users",
    },
  ],

  following: [
    {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
  ],

  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Posts",
    },
  ],

  players: [
    {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
  ],


});

module.exports = mongoose.model("Teams", Teamschema);
