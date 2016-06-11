var mongoose = require('mongoose');

var Menu = new mongoose.Schema({
    dishes: [{type: mongoose.Schema.ObjectId, ref: 'Dish'}],
    sides: [{type: mongoose.Schema.ObjectId, ref: 'Side'}]
});

module.exports = mongoose.model('Menu', Menu);