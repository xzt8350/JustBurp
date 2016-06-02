var Chef = require('../models/chef');
var Menu = require('../models/menu');
var Dish = require('../models/dish');
var DailyMenu = require('../models/dailyMenu');
var DailyDish = require('../models/dailyDish');

module.exports = function (req, res, next) {
    // TODO (zhenlily): get chef id from requestContext for query
    Chef.findOne({email: 'test@example.com'}, function (err, chef) {
        var dishesContext = [];
        if (chef.currentDailyMenu) {
            DailyMenu.findOne({_id: chef.currentDailyMenu}, function (err, dailyMenu) {
                DailyDish.find({_id:{$in: dailyMenu.dailyDishes}}, function (err, dailyDishes) {

                    function render() {
                        if (dishesContext.length == dailyDishes.length) {
                            req.dishesContext = dishesContext;
                            next();
                        }
                    }

                    dailyDishes.map(function (dailyDish) {
                        Dish.findOne({_id: dailyDish.dish}, function (err, dish) {
                            dishesContext.push({
                                title: dish.title,
                                imgUrl: dish.imgUrl,
                                priceDollar: dailyDish.priceDollarPart,
                                priceCent: dailyDish.priceCentPart,
                                quantity: dailyDish.quantity
                            });
                            render();
                        });
                    });
                })
            });
        } else {
            Menu.findOne({_id: chef.menu}, function (err, menu) {
                Dish.find({_id: {$in: menu.dishes}}, function (err, dishes) {
                    dishesContext = dishes.map(function (dish) {
                        return {
                            title: dish.title,
                            imgUrl: dish.imgUrl,
                            priceDollar: 0,
                            priceCent: 0,
                            quantity: 0
                        }
                    });
                    req.dishesContext = dishesContext;
                    next();
                });
            });
        }
    });
}