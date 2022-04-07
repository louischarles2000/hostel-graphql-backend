const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true
    },
    tenant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amountPaid: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
});

const ownerSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    phone: [
        {
            type: String,
            required: true
        }
    ],
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    gender: {
        type: String
    },
    hostel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hostel'
    },
    bookings: [
        {
            type: bookingSchema,
            required: true
        }
    ]
});


module.exports = mongoose.model('Owner', ownerSchema);
