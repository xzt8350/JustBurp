var express = require('express');
var router = express.Router();
var loadChefDish = require('../lib/loadChefDish');
var loadChefDailyMenu = require('../lib/loadChefDailyMenu');
var getNextTwoDates = require('../lib/getNextTwoDates');
var saveChefDailySchedule = require('../lib/saveChefDailySchedule');

router.get('/', function (req, res) {
    res.render('chefViewMainPage', {layout: "layout.hbs", user: req.user});
});

router.get('/chefDaily', loadChefDish, loadChefDailyMenu, getNextTwoDates, function (req, res) {
    res.render('chefDailySetup', {
        layout: "layout.hbs",
        user: req.user,
        dishes: req.dishesContext,
        dates: req.datesContext,
        saveMessage: req.flash('saveMessage')
    });
});

router.post('/saveChefDaily', saveChefDailySchedule, function (req, res) {
    res.redirect(303, '/chef/chefDaily');
});

module.exports = router;