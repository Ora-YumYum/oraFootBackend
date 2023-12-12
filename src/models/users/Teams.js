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
    required: false,
  },

  wilaya: {
    type: Number,
    required: false,
  },


  players: [
    {
      type: Schema.Types.ObjectId,
      ref: "Players",
    },
  ],


  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
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

    },
  ],


});

module.exports = mongoose.model("Teams", Teamschema);
