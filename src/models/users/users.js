const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({


  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },


  first_name: {
    type: String,
  },


  last_name: {
    type: String,
  },

  address: {
    type: String,
  },

  wilaya: {
    type: Number,

  },


  phone_number: {
    type: String,
    required: true,
  },


  gender: {
    type: Number,
    required: true,
  },


  user_type: {
    type: Number,
    required: true,
  },

  fcm_token: {
    type: String,
    required: false,
  },

  challanges: [
    {
      type: Schema.Types.ObjectId,
      ref: "Challanges",
    },
  ],
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comments",
    },
  ],


  player: {
    type: Schema.Types.ObjectId,
    ref: "Players",
  },


  staduim: {
    type: Schema.Types.ObjectId,
    ref: "Staduims",
  },


  photographer: {
    type: Schema.Types.ObjectId,
    ref: "Photographers",
  },


  doctor: {
    type: Schema.Types.ObjectId,
    ref: "Doctors",
  },


  refeers: {
    type: Schema.Types.ObjectId,
    ref: "Refeers",
  },


  team: {
    type: Schema.Types.ObjectId,
    ref: "Teams",
  },
});




module.exports = mongoose.model("User", userSchema);
