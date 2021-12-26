const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true,
    },

    age: {
        type: Number,
        min: 2,
        required: true,
    },

    phonenumber: {
        type: String,
        required: true,
    },
    privilege: {
        type: String,
        required: true
    }
});


const HRSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true,
    },

    age: {
        type: Number,
        min: 2,
        required: true,
    },

    phonenumber: {
        type: String,
        required: true,
    },
    privilege: {
        type: String,
        required: true
    }
});

const EMP = mongoose.model('Employee', EmployeeSchema, "Employee");
const HR = mongoose.model('HR', HRSchema, "HR");

module.exports = {
    EMP,
    HR,
};