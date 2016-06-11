var mongoose = require('mongoose');

var DailyDish =  new mongoose.Schema({
    dish: {type: mongoose.Schema.ObjectId, ref: 'Dish'},
    priceDollarPart: {
        type: Number,
        default: 0
    },
    priceCentPart: {
        type: Number,
        default: 0
    },
    quantity: {
        type: Number,
        default: 0
    }
});

DailyDish.methods.getDisplayPrice = function () {
    return '$' + (this.priceDollarPart + (this.priceCentPart / 100).toFixed(2));
};

module.exports = mongoose.model('DailyDish', DailyDish);