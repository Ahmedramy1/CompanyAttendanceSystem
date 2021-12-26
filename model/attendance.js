const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    
    id: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },

    clockin: {
        type: Date,
        default: Date.now,
        required: true,
    },
    clockout: {
        type: Date,
        required: false,
    },
    privilege: {
        type: String,
        required: true
    }
});


const ATTENDANCE = mongoose.model('ATTENDANCE', attendanceSchema, "AttendanceReport");

module.exports = {ATTENDANCE};