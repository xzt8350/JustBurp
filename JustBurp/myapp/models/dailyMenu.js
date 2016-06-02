var mongoose = require('mongoose');

var DailyMenuStatus = {
    ACTIVE: 1,
    COMPLETED: 2,
    DELETED: 3,
};

var DailyMenu = new mongoose.Schema({
    dailyDishes: [{type: mongoose.Schema.ObjectId, ref: 'DailyDish'}],
    date: Date,
    menuBegin: Date,
    menuEnd: Date,
    prepareBegin: Date,
    status: {
        type: Number,
        enum: [DailyMenuStatus.ACTIVE,
            DailyMenuStatus.COMPLETED,
            DailyMenuStatus.DELETED]
    }
});

module.exports = mongoose.model('DailyMenu', DailyMenu);