
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const RentsSchema = new Schema({


    staduim_id: {
        type: Schema.Types.ObjectId,
        ref: "Staduims",
        required: false,
    },

    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: false,
    },

    status: {
        type: Number,
        required: false,
        default: 2,
    },

    createdDate: {
        type: Date,
        default: Date.now(),
    },

    rent_date: {
        type: Date,
    },

    data: {
        type: {},
    },
});

module.exports = mongoose.model("Rents", RentsSchema);
