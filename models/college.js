const mongoose = require('mongoose');
const location = require('./location');


const collegeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        type: location,
        required: true  
    }
});


module.exports = mongoose.model('College', collegeSchema);