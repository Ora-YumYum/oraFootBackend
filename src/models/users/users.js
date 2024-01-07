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
    required: false,
  },

  last_name: {
    type: String,
    required: false,
  },

  address: {
    type: String,
    required: false,
  },

  wilaya: {
    type: Number,
    required: false,
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

  profile_img: {
    type: String,
    required: false,
  },

  challanges: [
    {
      type: Schema.Types.ObjectId,
      ref: "Challanges",
    },
  ],

  invitations: [
    {
      type: Schema.Types.ObjectId,
      ref: "Invitation",
    },
  ],

  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comments",
    },
  ],


  notifications: [
    {
      type: Schema.Types.ObjectId,
      ref: "Notifications",
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


  refree: {
    type: Schema.Types.ObjectId,
    ref: "Refeers",
  },


  team: {
    type: Schema.Types.ObjectId,
    ref: "Teams",
  },

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
});




module.exports = mongoose.model("User", userSchema);
