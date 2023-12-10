const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const StaduimsSchema = new Schema({

    staduim_id: {
        type: String,
        required: false,
    },

    staduim_name: {
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

    location: {
        type: {
            
        },
        
    },
    
    price_per_hour: {
        type: Number,
        required: false,
    },

    price_per_month: {
        type: Number,
        required: false,
    },

    price_per_year: {
        type: Number,
        required: false,
    },

    staduim_img: {
        type: String,
        required: false,
    },

    photos: [
        {
            type : String,
        }
    ],
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

});

module.exports = mongoose.model("Staduims", StaduimsSchema);
