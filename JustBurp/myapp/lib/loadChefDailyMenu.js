var DailyMenu = require('../models/dailyMenu');

module.exports = function (req, res, next) {
    var dailyMenus = [];

    var chef = req.chef;

    if (!req.currentDailyMenu) {
        if (chef.dailyMenus.length > 0){
            DailyMenu.findOne({_id: chef.dailyMenus[chef.dailyMenus.length - 1]}, function (err, dailyMenu) {
                dailyMenus.push({dailyMenu: dailyMenu});
                dailyMenus.push({dailyMenu: dailyMenu});
                req.dailyMenus = dailyMenus;
                next();
            });
        } else {
            next();
        }
        return;
    }

    dailyMenus.push({dailyMenu: req.currentDailyMenu});

    if (chef.futureDailyMenu) {
        DailyMenu.findOne({_id: chef.futureDailyMenu}, function (err, dailyMenu) {
            dailyMenus.push({dailyMenu: dailyMenu});
            req.dailyMenus = dailyMenus;
            next();
        });
    } else {
        dailyMenus.push({dailyMenu: req.currentDailyMenu});
        req.dailyMenus = dailyMenus;
        next();
    }
}