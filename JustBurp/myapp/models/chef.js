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
    zipCode: {
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
    isOnline: {
        type: Boolean,
        default: false
    },
    lastUpdatedDate: Date,
    menu: {type: mongoose.Schema.ObjectId, ref: 'Menu'},
    dailyMenus: [{type: mongoose.Schema.ObjectId, ref: 'DailyMenu'}],
    currentDailyMenu: {type: mongoose.Schema.ObjectId, ref: 'DailyMenu'}
});


module.exports = mongoose.model('Chef', Chef);