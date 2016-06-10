var dateAndTimeUtil = require('../utils/dateAndTimeUtil');

var DEFAULT_PREPARE_BEGIN_TIME = '4:00pm';
var DEFAULT_MENU_BEGIN_TIME = '6:00pm';
var DEFAULT_MENU_END_TIME = '10:00pm';

module.exports = function (req, res, next) {
    var today = new Date();
    var tmr = dateAndTimeUtil.getDateWithDiff(today, 1);
    var dayAfterTmr = dateAndTimeUtil.getDateWithDiff(today, 2);
    var dates = [tmr, dayAfterTmr];
    var dailyMenus = req.dailyMenus;

    var datesSize = dates.length;
    var datesContext = [];
    for (var i = 0; i < datesSize; i++) {
        var noCooking = dailyMenus ? dailyMenus[i].dailyMenu.noCooking : false;
        var prepareBegin = dailyMenus && !noCooking ? dateAndTimeUtil.getTimeString(dailyMenus[i].dailyMenu.prepareBegin) : DEFAULT_PREPARE_BEGIN_TIME;
        var startTime = dailyMenus && !noCooking ? dateAndTimeUtil.getTimeString(dailyMenus[i].dailyMenu.menuBegin) : DEFAULT_MENU_BEGIN_TIME;
        var endTime = dailyMenus && !noCooking ? dateAndTimeUtil.getTimeString(dailyMenus[i].dailyMenu.menuEnd) : DEFAULT_MENU_END_TIME;

        datesContext.push({
            dateString: 'Date: ' + dateAndTimeUtil.getDateString(dates[i]),
            isNoCooking: noCooking,
            prepareStartTime: prepareBegin,
            startTime: startTime,
            endTime: endTime
        });
    }

    req.datesContext = datesContext;
    next();
}