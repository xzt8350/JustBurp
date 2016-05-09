var mongoose = require('mongoose');

var User = new mongoose.Schema({
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
    },
    isAdmin : {
        type: Boolean,
        default: false 
    }    
});


module.exports = mongoose.model('User', User);

