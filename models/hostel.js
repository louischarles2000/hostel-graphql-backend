const mongoose = require('mongoose');
const location = require('./location');

const priceRangeSchema = new mongoose.Schema({
    minimmumPrice: {
        type: Number,
        required: true
    },
    maximmumPrice: {
        type: Number,
        required: true
    },
});

const hostelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
    },
    gender: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    bookingRate: {
        type: Number,
        required: true,
        min: 10,
        max: 60
    },
    restrictedPayment: {
        type: Boolean,
        required: true
    },
    paymentDetails: {
        type: String
    },
    additionalPayment: {
        type: Number,
        default: 0
    },
    priceRange: {
        type: priceRangeSchema,
        required: true
    },
    reportingInstructions: {
        type: [String]
    },
    rules: {
        type: [String]
    },
    services: {
        type: [String]
    },
    images: {
        type: [String]
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Owner'
    },
    address: {
        type: String,
        required: true
    },
    location: {
        type: location,
        required: true
    }
});


module.exports = mongoose.model('Hostel', hostelSchema);