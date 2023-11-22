

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const invitationSchema = new Schema({

    type: {
        type: String,
        required: false,
    },

    user_id: {
        type: String,
        required: false,
    },

    status: {
        type: Number,
        required: false,
        default : 2,
    },

    createdDate: {
        type: Date,
        default: Date.now(),
    },

    data: {
        type: {},
    },
});

module.exports = mongoose.model("Invitation", invitationSchema);
