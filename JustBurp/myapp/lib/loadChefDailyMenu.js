var DailyMenu = require('../models/dailyMenu');

module.exports = function (req, res, next) {
    var dailyMenusContext = [];

    var chef = req.chef;

    if (!req.currentDailyMenu) {
        if (chef.dailyMenus.length > 0) {
            DailyMenu.findOne({_id: chef.dailyMenus[chef.dailyMenus.length - 1]}, function (err, dailyMenu) {
                dailyMenusContext.push({dailyMenu: dailyMenu}, {dailyMenu: dailyMenu}, {dailyMenu: dailyMenu});
                req.dailyMenus = dailyMenusContext;
                next();
            });
        } else {
            next();
        }
        return;
    }

    dailyMenusContext.push({dailyMenu: req.currentDailyMenu});

    if (chef.tmrDailyMenu && chef.futureDailyMenu) {
        DailyMenu.find({_id: {$in: [chef.tmrDailyMenu, chef.futureDailyMenu]}}, function (err, dailyMenus) {
            dailyMenus.map(function (dailyMenu) {
                dailyMenusContext.push({dailyMenu: dailyMenu});
            })
            req.dailyMenus = dailyMenusContext;
            next();
        });
    } else {
        dailyMenusContext.push({dailyMenu: req.currentDailyMenu}, {dailyMenu: req.currentDailyMenu});
        req.dailyMenus = dailyMenusContext;
        next();
    }
}