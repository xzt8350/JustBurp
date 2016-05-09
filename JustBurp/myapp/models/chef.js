var mongoose = require('mongoose');

var Chef = new mongoose.Schema({
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
    phoneNum: {
        type: String,
        trim: true
    },
    nationality: {
        type: String,
        trim: true
    },
    introduction: {
        type: String,
        trim: true
    },
    isOnline : {
        type: Boolean,
        default: false 
    }, 
    lastUpdatedDate: {
        type: Date
    }
});


module.exports = mongoose.model('Chef', Chef);