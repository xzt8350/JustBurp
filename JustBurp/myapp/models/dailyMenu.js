var mongoose = require('mongoose');

var DailyMenuStatus = {
    ACTIVE: 1,
    COMPLETED: 2,
    INACTIVE: 3,
};

var DailyMenu = new mongoose.Schema({
    dailyDishes: [{type: mongoose.Schema.ObjectId, ref: 'DailyDish'}],
    date: Date,
    noCooking: Boolean,
    menuBegin: Date,
    menuEnd: Date,
    prepareBegin: Date, // TODO (zhenlily): rename it deliveryDeadline, change all corresponding naming
    noFreeItem: Boolean,
    freeItemTitle: String,
    freeItemQty: Number,
    status: {
        type: Number,
        enum: [DailyMenuStatus.ACTIVE,
            DailyMenuStatus.COMPLETED,
            DailyMenuStatus.INACTIVE]
    }
});

module.exports = mongoose.model('DailyMenu', DailyMenu);