const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    email: {
        type: String
    },
    college: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'College'
    },
    saved: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Room'
        }
    ],
    birthday: {
        type: Date,
        required: false
    },
    roomStatus: {
        status: {
            type: String,
            default: 'no room'
        },
        room: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Room'
        }
    },
});


module.exports = mongoose.model('User', userSchema);
