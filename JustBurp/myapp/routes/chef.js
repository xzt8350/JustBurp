var express = require('express');
var router = express.Router();
var loadChefDish = require('../mid/loadChefDish');

router.get('/', function (req, res) {
    res.render('chefViewMainPage', {layout: "layout.hbs", user: req.user});
});

router.get('/chefDaily', loadChefDish, function (req, res) {
    res.render('chefDailySetup', {layout: "layout.hbs", user: req.user, dishes: req.dishesContext});
});

module.exports = router;