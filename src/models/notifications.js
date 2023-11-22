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
        },

        title: {
            type: String,
            required: false,
        },

        user_name: {
            type: String,
            required: false,
        },

        user_id: { type: Schema.Types.ObjectId, ref: "Users"},

        invitation: { type: Schema.Types.ObjectId, ref: "Invitation"},


        notifcation_pic: String,

        created_at: {
            type: Date,
            default: Date.now,
        },

        read: {
            type: Boolean,
            default: false
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