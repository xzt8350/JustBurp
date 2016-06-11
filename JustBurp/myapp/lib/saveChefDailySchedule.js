var dateAndTimeUtil = require('../utils/dateAndTimeUtil');
var Chef = require('../models/chef');
var DailyMenu = require('../models/dailyMenu');
var DailyDish = require('../models/dailyDish');

var DUMMY_STRING = 'X';
var SAVE_MSG = 'saveMessage';
var SUCCEEDS_MSG = 'Schedule saved!';
var FAIL_MSG = 'Failed to save schedule.';
var INVALID_TIME_INPUT_MSG = 'Invalid time inputs.';
var INVALID_PRICE_QUANTITY_INPUT_MSG = 'Invalid price or quantity inputs.';

var isSame = function (array1, array2, selectedIndexes) {
    return (array1.length == array2.length) && array1.every(function (element, index) {
            if (selectedIndexes && selectedIndexes.indexOf(index) === -1) {
                return true;
            }
            return element === array2[index];
        });
}

var noInputChanges = function (req, prepareStartTimes, startTimes, endTimes) {

    var noTimeChanges = function (req, prepareStartTimes, startTimes, endTimes) {
        if (!isSame(req.body.previousIsNoCooking, req.body.isNoCookingChecked)) {
            return false;
        }

        var selectedIndexes = [];

        for (var i = 0; i < req.body.isNoCookingChecked.length; i++) {
            if (req.body.isNoCookingChecked[i] !== 'true') {
                selectedIndexes.push(i);
            }
        }

        if (selectedIndexes.length === 0) {
            return true;
        }

        return isSame(req.body.previousPrepareStartTime, prepareStartTimes, selectedIndexes)
            && isSame(req.body.previousStartTime, startTimes, selectedIndexes)
            && isSame(req.body.previousEndTime, endTimes, selectedIndexes);
    }

    return isSame(req.body.previousPriceDollar, req.body.priceDollar)
        && isSame(req.body.previousPriceCent, req.body.priceCent)
        && isSame(req.body.previousQuantity, req.body.quantity)
        && noTimeChanges(req, prepareStartTimes, startTimes, endTimes);
}

var isValidTimeString = function (timeString) {
    return /^(\d\d?:\d\d(a|p)m)$/.test(timeString);
}

var validateInputFail = function (req, prepareStartTimes, startTimes, endTimes, dateSize) {
    for (var i = 0; i < dateSize; i++) {
        if (req.body.isNoCookingChecked[i] !== 'true') {
            if (!(isValidTimeString(prepareStartTimes[i])
                && isValidTimeString(startTimes[i])
                && isValidTimeString(endTimes[i]))) {
                req.flash(SAVE_MSG, INVALID_TIME_INPUT_MSG);
                return true;
            }
        }
    }

    req.checkBody('priceDollar', 'priceDollar must be an array').isArray();
    for (var i = 0; i < req.body.priceDollar.length; i++) {
        req.checkBody('priceDollar', 'priceDollar[' + i + '] must be an number').isNumberElement(i);
    }
    req.checkBody('priceCent', 'priceCent must be an array').isArray();
    for (var i = 0; i < req.body.priceCent.length; i++) {
        req.checkBody('priceCent', 'priceCent[' + i + '] must be an number').isNumberElement(i);
    }
    req.checkBody('quantity', 'quantity must be an array').isArray();
    for (var i = 0; i < req.body.quantity.length; i++) {
        req.checkBody('quantity', 'quantity[' + i + '] must be an number').isNumberElement(i);
    }

    var errors = req.validationErrors();
    if (errors) {
        req.flash(SAVE_MSG, INVALID_PRICE_QUANTITY_INPUT_MSG);
        return true;
    }

    return false;
}

var saveDailyDishes = function (req) {
    var dailyDishIds = [];
    for (var i = 0; i < req.body.dishId.length; i++) {
        var dailyDish = new DailyDish({
            dish: req.body.dishId[i],
            priceDollarPart: req.body.priceDollar[i],
            priceCentPart: req.body.priceCent[i],
            quantity: req.body.quantity[i]
        });
        dailyDish.save();
        dailyDishIds.push(dailyDish._id);
    }
    return  dailyDishIds;
}

var saveDailyMenus = function (req, dailyDishIds, prepareStartTimes, startTimes, endTimes, dateSize) {
    var dailyMenuIds = [];
    for (var i = 0; i < dateSize; i++) {
        var noCooking = req.body.isNoCookingChecked[i] === 'true';
        var dayDiff = i + 1;

        var dailyMenu = new DailyMenu({
            dailyDishes: dailyDishIds,
            date: new Date(),
            noCooking: noCooking,
            menuBegin: noCooking ? null : dateAndTimeUtil.getDateFromTimeString(startTimes[i], i + dayDiff),
            menuEnd: noCooking ? null : dateAndTimeUtil.getDateFromTimeString(endTimes[i], i + dayDiff),
            prepareBegin: noCooking ? null : dateAndTimeUtil.getDateFromTimeString(prepareStartTimes[i], i + dayDiff),
            status: 1
        });
        dailyMenu.save();
        dailyMenuIds.push(dailyMenu._id);
    }
    return dailyMenuIds;
}

var updateChef = function (req, next, dailyMenuIds) {
    Chef.findOne({email: 'test@example.com'}, function (err, chef) {
        var previousCurrentDailyMenu = chef.currentDailyMenu;
        var previousFutureDailyMenu = chef.futureDailyMenu;

        DailyMenu.update({_id: {$in: [previousCurrentDailyMenu, previousFutureDailyMenu]}},
            {
                $set: {
                    status: 3
                }
            },
            {
                multi: true
            }, function (err) {
                if (err) {
                    console.log("Fail to update DailyMenu: " + err);
                    req.flash(SAVE_MSG, FAIL_MSG);
                    next();
                    return;
                }
            });
    });

    Chef.update({email: 'test@example.com'},
        {
            $set: {
                currentDailyMenu: dailyMenuIds[0],
                futureDailyMenu: dailyMenuIds[1]
            },
            $push: {
                dailyMenus: {$each: dailyMenuIds}
            },
        }, function (err) {
            if (err) {
                console.log("Fail to update Chef: " + err);
                req.flash(SAVE_MSG, FAIL_MSG);
                next();
            } else {
                req.flash(SAVE_MSG, SUCCEEDS_MSG);
                next();
            }
        });
}

module.exports = function (req, res, next) {

    var dateSize = req.body.isNoCookingChecked.length;

    // putting data in list format so it's ready for operating.
    var prepareStartTimes = [];
    var startTimes = [];
    var endTimes = [];
    if (!Array.isArray(req.body.prepareStartTime)) {
        for (var i = 0; i < dateSize; i++) {
            if (req.body.isNoCookingChecked[i] === 'true') {
                prepareStartTimes.push(DUMMY_STRING);
                startTimes.push(DUMMY_STRING);
                endTimes.push(DUMMY_STRING);
            } else {
                prepareStartTimes.push(req.body.prepareStartTime);
                startTimes.push(req.body.startTime);
                endTimes.push(req.body.endTime);
            }
        }
    } else {
        prepareStartTimes = req.body.prepareStartTime;
        startTimes = req.body.startTime;
        endTimes = req.body.endTime;
    }

    if (noInputChanges(req, prepareStartTimes, startTimes, endTimes)) {
        console.log("No changes has been made.");
        req.flash(SAVE_MSG, SUCCEEDS_MSG);
        next();
        return;
    }


    if (validateInputFail(req, prepareStartTimes, startTimes, endTimes, dateSize)) {
        next();
        return;
    }

    var dailyDishIds = saveDailyDishes(req);
    var dailyMenuIds = saveDailyMenus(req, dailyDishIds, prepareStartTimes, startTimes, endTimes, dateSize);
    updateChef(req, next, dailyMenuIds);
}