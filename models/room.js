const mongoose = require('mongoose');

const attributesSchema = new mongoose.Schema({
    tenants: { 
        type: Number,
        required: true 
    },
    bedsProvided: { 
        type: Boolean,
        default: true
    },
    privateBathroom: { 
        type: Boolean,
        required: true
    },
    hasWardrobe: { 
        type: Boolean,
    },
    hasBalcony: { 
        type: Boolean,
    },
});

const roomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    hostel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hostel'
    },
    available: {
        type: Boolean,
        default: true
    },
    booked: {
        type: Boolean,
        default: false
    },
    price: {
        type: Number,
        required: true
    },
    hostel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hostel'
    },
    attributes: {
        type: attributesSchema,
        required: true
    },
    images: [String],
    quantity: {
        type: Number,
        required: true
    }
});


module.exports = mongoose.model('Room', roomSchema);