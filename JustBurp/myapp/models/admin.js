var mongoose = require('mongoose');

var Admin = new mongoose.Schema({
	email: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        trim: true
    },
    firstName: {
        type: String,
        trim: true
    },
    lastName: {
        type: String,
        trim: true
    }
});


module.exports = mongoose.model('Admin', Admin);