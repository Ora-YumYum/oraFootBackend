

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const storesTypesSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    icon: {
        type: String,
        required: false
    },
    status: {
        type: Boolean,
        default: false
    },
});

module.exports = mongoose.model("StoresTypes", storesTypesSchema);
