var Dish = require('../../models/dish');
var Side = require('../../models/side');
var Menu = require('../../models/menu');
var DailyMenu = require('../../models/dailyMenu');
var DailyDish = require('../../models/dailyDish');
var Chef = require('../../models/chef');

module.exports = function () {
    console.log('Test data status.');

    var dish1 = new Dish({
        title: 'Test Dish 1',
        imgUrl: 'http://img1.meichubang.com/pic/201405/65d2de55ed4a93f11b9e0c7d7b382d4c.jpg',
        description: 'Description for Test Dish 1'
    });
    var dish2 = new Dish({
        title: 'Test Dish 2',
        imgUrl: 'http://www.zuofanwang.net/uploads/userup/1586/1441E1435-6327.jpg',
        description: 'Description for Test Dish 2'
    });

    Dish.find(function (err, dishes) {
        if (dishes.length) {
            console.log('# of dishes: ' + dishes.length);
            return;
        }

        dish1.save();
        dish2.save();
        console.log('2 dishes saved');
    });

    var side = new Side({
        title: 'Test Side',
        priceInCents: 100,
    });

    Side.find(function (err, sides) {
        if (sides.length) {
            console.log('# of sides: ' + sides.length);
            return;
        }

        side.save();
        console.log('1 side saved');
    });

    var menu = new Menu({
        dishes: [dish1._id, dish2._id],
        sides: [side._id]
    });

    Menu.find(function (err, menus) {
        if (menus.length) {
            console.log('# of menus: ' + menus.length);
            return;
        }

        menu.save();
        console.log('1 menu saved');
    });

    var dailyDish1 = new DailyDish({
        dish: dish1._id,
        priceDollarPart: 8,
        priceCentPart: 0,
        quantity: 5
    });

    var dailyDish2 = new DailyDish({
        dish: dish2._id,
        priceDollarPart: 4,
        priceCentPart: 99,
        quantity: 8
    });

    var dailyDish3 = new DailyDish({
        dish: dish1._id,
        priceDollarPart: 7,
        priceCentPart: 99,
        quantity: 5
    });

    DailyDish.find(function (err, dailyDishes) {
        if (dailyDishes.length) {
            console.log('# of dailyDishes: ' + dailyDishes.length);
            return;
        }

        dailyDish1.save();
        dailyDish2.save();
        dailyDish3.save();
        console.log('3 dailyDishes saved');
    });

    var dailyMenu1 = new DailyMenu({
        dailyDishes: [dailyDish1._id, dailyDish2._id],
        date: new Date(2016, 4, 30, 0, 0, 0),
        noCooking: false,
        menuBegin: new Date(2016, 4, 30, 18, 0, 0),
        menuEnd: new Date(2016, 4, 30, 22, 0, 0),
        prepareBegin: new Date(2016, 4, 30, 17, 0, 0),
        status: 1
    });
    var dailyMenu2 = new DailyMenu({
        dailyDishes: [dailyDish3._id, dailyDish2._id],
        date: new Date(2016, 4, 28, 0, 0, 0),
        noCooking: false,
        menuBegin: new Date(2016, 4, 28, 17, 0, 0),
        menuEnd: new Date(2016, 4, 28, 21, 0, 0),
        prepareBegin: new Date(2016, 4, 28, 16, 0, 0),
        status: 2
    });
    var dailyMenu3 = new DailyMenu({
        dailyDishes: [dailyDish1._id, dailyDish2._id],
        date: new Date(2016, 5, 1, 0, 0, 0),
        noCooking: false,
        menuBegin: new Date(2016, 5, 1, 19, 0, 0),
        menuEnd: new Date(2016, 5, 1, 23, 0, 0),
        prepareBegin: new Date(2016, 5, 1, 18, 0, 0),
        status: 1
    });

    DailyMenu.find(function (err, dailyMenus) {
        if (dailyMenus.length) {
            console.log('# of dailyMenus: ' + dailyMenus.length);
            return;
        }

        dailyMenu1.save();
        dailyMenu2.save();
        dailyMenu3.save();
        console.log('3 dailyMenus saved');
    });

    var chef = new Chef({
        email: 'test@example.com',
        password: 'testPass',
        firstName: 'TEST',
        lastName: 'NAME',
        phoneNum: '888-888-8888',
        zipCode: '88888',
        nationality: 'China',
        introduction: 'test intro',
        isOnline: false,
        lastUpdatedDate: new Date('2016-05-26T00:00:00'),
        menu: menu._id,
        dailyMenus: [dailyMenu2._id, dailyMenu1._id],
        currentDailyMenu: dailyMenu1._id,
        futureDailyMenu: dailyMenu3._id
    });

    Chef.find(function (err, chefs) {
        if (chefs.length) {
            console.log('# of chefs: ' + chefs.length);
            return;
        }

        chef.save();
        console.log('1 chef saved');
    });
}



