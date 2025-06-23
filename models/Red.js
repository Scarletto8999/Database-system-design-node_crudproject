const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({      
    _id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    Date_of_birth: {
        type: Date,
        required: true
        
    },
    Place_of_birth: {
        type: String,
        required: true,
    },
    Nationality: {
        type: String,
        required: true,
    },
    Gender: {
        type: String,
        required: true,
    },
    Status: {
        type: String,
        required: true,
    },
    Resource: {
        type: String,
        required: true,
    },
    Description: {
        Height: {
            type: Number,
            required: true,
        },
        Hair: {
            type: String,
            required: true,
        },
        Eyes: {
            type: String,
            required: true,
        },
        Language_spoken: {
            type: [String],
            required: true,
        },
    },
    Charges: {
        type: [String],
        required: true,
    },
    created: {
        type: Date,
        required : true,
        default: Date.now,
    },
}, { getters: true });
module.exports = mongoose.model('Red', userSchema);
