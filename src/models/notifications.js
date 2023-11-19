const mongoose = require("mongoose");


var Schema = mongoose.Schema;

const requiredString = {
    type: String,
    required: false,
};

const NotificationsSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },

        user_name: {
            type: String,
            required: true,
        },

        user_id: { type: Schema.Types.ObjectId, ref: "Users" },


        notifcation_pic: String,

        created_at: {
            type: Date,
            default: Date.now,
        },

        read: {
            type: Boolean,
            default: false
        },
        
        notification_type: {
            type: Number,
            default: 0,
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