const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        min: 8,
    },

    password: {
        type: String,
        required: true,
        min: 8,
    },

    age: {
        type: Number,
        min: 2,
        required: true,
    },

    phonenumber: {
        type: String,
        required: true,
        min: 5,
    },
    privilege: {
        type: String,
        required: true
    }
});

module.exports = (mongoose.model('Employee', EmployeeSchema, "Employee"));