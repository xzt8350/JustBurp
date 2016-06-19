var dateAndTimeUtil = require('../utils/dateAndTimeUtil');
var Chef = require('../models/chef');
var DailyMenu = require('../models/dailyMenu');
var DailyDish = require('../models/dailyDish');

var DUMMY_STRING = 'X';
var SAVE_MSG = 'saveMessage';
var SUCCEEDS_MSG = 'Schedule saved!';
var FAIL_MSG = 'Failed to save schedule.';
var INVALID_TIME_INPUT_MSG = 'Invalid time inputs.';
var INVALID_FREE_ITEM_TITLE_INPUT_MSG = 'Invalid free item title.';
var INVALID_PRICE_QUANTITY_INPUT_MSG = 'Invalid price or quantity inputs.';

var isSame = function (array1, array2, selectedIndexes) {
    return (array1.length == array2.length) && array1.every(function (element, index) {
            if (selectedIndexes && selectedIndexes.indexOf(index) === -1) {
                return true;
            }
            return element === array2[index];
        });
}

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

var noFreeItemChanges = function (req, freeItemTitles, freeItemQtys) {
    if (!isSame(req.body.previousIsNoFreeItem, req.body.isNoFreeItemChecked)) {
        for (var i = 0; i < req.body.isNoFreeItemChecked.length; i++) {
            if (!(req.body.previousIsNoFreeItem[i] === req.body.isNoFreeItemChecked[i] ||
                (req.body.previousIsNoFreeItem[i] !== req.body.isNoFreeItemChecked[i] &&
                req.body.previousIsNoCooking[i] === req.body.isNoCookingChecked[i] &&
                req.body.isNoCookingChecked[i] === 'true'))) {
                return false;
            }
        }
    }

    var selectedIndexes = [];

    for (var i = 0; i < freeItemTitles.length; i++) {
        if (freeItemTitles[i] !== DUMMY_STRING) {
            selectedIndexes.push(i);
        }
    }

    if (selectedIndexes.length === 0) {
        return true;
    }

    return isSame(req.body.previousFreeItemTitle, freeItemTitles, selectedIndexes)
        && isSame(req.body.previousFreeItemQty, freeItemQtys, selectedIndexes);
}

var noInputChanges = function (req, prepareStartTimes, startTimes, endTimes, freeItemTitles, freeItemQtys) {
    return isSame(req.body.previousPriceDollar, req.body.priceDollar)
        && isSame(req.body.previousPriceCent, req.body.priceCent)
        && isSame(req.body.previousQuantity, req.body.quantity.slice(0,2))
        && noTimeChanges(req, prepareStartTimes, startTimes, endTimes)
        && noFreeItemChanges(req, freeItemTitles, freeItemQtys);
}

var isValidTimeInterval = function (startTimeString, endTimeString) {
    var startTime = dateAndTimeUtil.getDateFromTimeString(startTimeString, 0);
    var endTime = dateAndTimeUtil.getDateFromTimeString(endTimeString, 0);
    return startTime <= endTime;
}

var validateInputFail = function (req, prepareStartTimes, startTimes, endTimes, freeItemTitles, dateSize) {
    for (var i = 0; i < dateSize; i++) {
        if (req.body.isNoCookingChecked[i] !== 'true') {
            if (!isValidTimeInterval(startTimes[i], endTimes[i])) {
                req.flash(SAVE_MSG, INVALID_TIME_INPUT_MSG);
                return true;
            }
        }
    }

    for (var i = 0; i < freeItemTitles.length; i++) {
        if (!freeItemTitles[i]) {
            req.flash(SAVE_MSG, INVALID_FREE_ITEM_TITLE_INPUT_MSG);
            return true;
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

var saveDailyMenus = function (req, dailyDishIds, prepareStartTimes, startTimes, endTimes, freeItemTitles, freeItemQtys, dateSize) {
    var dailyMenuIds = [];
    for (var i = 0; i < dateSize; i++) {
        var noCooking = req.body.isNoCookingChecked[i] === 'true';
        var noFreeItem = req.body.isNoFreeItemChecked[i] === 'true';

        var dailyMenu = new DailyMenu({
            dailyDishes: dailyDishIds,
            date: new Date(),
            noCooking: noCooking,
            noFreeItem: noFreeItem,
            freeItemTitle: noCooking || noFreeItem ? null : freeItemTitles[i],
            freeItemQty: noCooking || noFreeItem ? null : freeItemQtys[i],
            menuBegin: noCooking ? null : dateAndTimeUtil.getDateFromTimeString(startTimes[i], i),
            menuEnd: noCooking ? null : dateAndTimeUtil.getDateFromTimeString(endTimes[i], i),
            prepareBegin: noCooking ? null : dateAndTimeUtil.getDateFromTimeString(prepareStartTimes[i], i),
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
        var previousTmrDailyMenu = chef.tmrDailyMenu;
        var previousFutureDailyMenu = chef.futureDailyMenu;

        DailyMenu.update({_id: {$in: [previousCurrentDailyMenu, previousTmrDailyMenu, previousFutureDailyMenu]}},
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
                tmrDailyMenu: dailyMenuIds[1],
                futureDailyMenu: dailyMenuIds[2]
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

    var hasOneDateInput = !Array.isArray(req.body.prepareStartTime);
    for (var i = 0; i < dateSize; i++) {
        var addTimeToList = function (prepareStartTime, startTime, endTime) {
            prepareStartTimes.push(prepareStartTime);
            startTimes.push(startTime);
            endTimes.push(endTime);
        };
        if (req.body.isNoCookingChecked[i] === 'true') {
            addTimeToList(DUMMY_STRING, DUMMY_STRING, DUMMY_STRING);
        } else if (hasOneDateInput) {
            addTimeToList(req.body.prepareStartTime, req.body.startTime, req.body.endTime);
        } else {
            addTimeToList(req.body.prepareStartTime[i], req.body.startTime[i], req.body.endTime[i]);
        }
    }

    var freeItemTitles = [];
    var freeItemQtys = [];

    hasOneDateInput = !Array.isArray(req.body.freeItemTitle);
    for (var i = 0; i < dateSize; i++) {
        var freeItemToList = function (freeItemTitle, freeItemQty) {
            freeItemTitles.push(freeItemTitle);
            freeItemQtys.push(freeItemQty);
        };
        if (req.body.isNoCookingChecked[i] === 'true' || req.body.isNoFreeItemChecked[i] === 'true') {
            freeItemToList(DUMMY_STRING, DUMMY_STRING);
        } else if (hasOneDateInput) {
            freeItemToList(req.body.freeItemTitle, req.body.quantity[2]);
        } else {
            freeItemToList(req.body.freeItemTitle[i], req.body.quantity[i + 2]);
        }
    }

    console.log("prepareStartTimes: " + prepareStartTimes);
    console.log("startTimes: " + startTimes);
    console.log("endTimes: " + endTimes);
    console.log("freeItemTitles: " + freeItemTitles);
    console.log("freeItemQtys: " + freeItemQtys);

    console.log("isNoFreeItemChecked: " + req.body.isNoFreeItemChecked);
    console.log("freeItemTitle: " + req.body.freeItemTitle);
    console.log("quantity: " + req.body.quantity);

    if (noInputChanges(req, prepareStartTimes, startTimes, endTimes, freeItemTitles, freeItemQtys)) {
        console.log("No changes has been made.");
        req.flash(SAVE_MSG, SUCCEEDS_MSG);
        next();
        return;
    }

    if (validateInputFail(req, prepareStartTimes, startTimes, endTimes, freeItemTitles, dateSize)) {
        next();
        return;
    }

    var dailyDishIds = saveDailyDishes(req);
    var dailyMenuIds = saveDailyMenus(req, dailyDishIds, prepareStartTimes, startTimes, endTimes, freeItemTitles, freeItemQtys, dateSize);
    updateChef(req, next, dailyMenuIds);
}