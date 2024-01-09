const mongoose = require("mongoose");


var Schema = mongoose.Schema;

const requiredString = {
    type: String,
    required: false,
};

const NotificationsSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            required : false
        },

        title: {
            type: String,
            required: false,
        },

        user_id: { type: Schema.Types.ObjectId, ref: "Users"},

        invitation: { type: Schema.Types.ObjectId, ref: "Invitation"},

        img: {
            type : String,
            default : ""
        },

        created_at: {
            type: Date,
            default: Date.now,
        },

        read: {
            type: Boolean,
            default: false
        },

        data: {
            type: {},
        },

    },
    {
        timestamps: true,
        minimize: false,
    },

    { collection: 'Notifications' }
);

const Notifications = mongoose.model("Notifications", NotificationsSchema);

module.exports = Notifications;