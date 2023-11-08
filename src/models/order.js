const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  orderID: {
    type: String,
    required: true,
  },
  userID: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  restuarntID: {
    type: Schema.Types.ObjectId,
    ref: "Restaurant",
  },
  items: [
    {
      type: Schema.Types.ObjectId,
      ref: "Food",
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  orderDate: {
    type: Date,
  },
  orderStatus: {
    type: String,
  },
});

module.exports = mongoose.model("Order", orderSchema);
