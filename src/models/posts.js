const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const Posts = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "Users",
  },
  post_img: {
    type: String,
    required: true,
  },
  date: {
    type: Date.now(),
    required: true,
  },
  post_status: {
    type: Number,
    required: true,
  },
  desc: {
    type: String,
    required: true
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comments",
    },
  ],
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
  ],
  shares: [
    {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
  ],
});

module.exports = mongoose.model("Posts", Posts);
