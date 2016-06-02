var mongoose = require('mongoose');

var Dish = new mongoose.Schema({
    title: {
        type: String,
        trim: true
    },
    imgUrl: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    }
});

module.exports = mongoose.model('Dish', Dish);