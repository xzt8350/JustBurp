var mongoose = require('mongoose');

var Side = new mongoose.Schema({
    title: {
        type: String,
        trim: true
    },
    priceInCents: {
        type: Number,
        default: 0
    },
});

Side.methods.getDisplayPrice = function () {
    return '$' + (this.priceInCents / 100).toFixed(2);
};

module.exports = mongoose.model('Side', Side);