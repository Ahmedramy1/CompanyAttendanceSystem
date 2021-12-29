const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    privilege: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
    },
    StartsFrom: {
        type: Date,
        required: true
    },
    EndDate: {
        type: Date,
        required: true
    },
    Status: {
        type: String,
        required: true,
        default: "Pending"
    },
    Description: {
        type: String,
        required: true,
    }

});

module.exports = (mongoose.model('Request', RequestSchema, "Request"));