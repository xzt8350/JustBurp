var express = require('express');
var router = express.Router();

var chefApplicationGenerator = require('../tools/chefApplicationGenerator.js');


var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/');
}

var isAuthenticatedAdmin = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response object

	if (req.user.isAdmin && req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/admin');
}

module.exports = function(passport, transporter){
	/* GET login page. */
	router.get('/', function(req, res) {
    	// Display the Login page with any flash message, if any
		res.render('index', { layout: "layout.hbs", message: req.flash('message')});
	});

	/* Handle Login POST */
	router.post('/login', passport.authenticate('login', {
		successRedirect: '/mainPage',
		failureRedirect: '/',
		failureFlash: true  
	}));

	/* Handle Registration POST */
	router.post('/signup', passport.authenticate('signup', {
		successRedirect: '/mainPage',
		failureRedirect: '/',
		failureFlash: true
	}));

	/* GET Home Page */
	router.get('/mainPage', isAuthenticated, function(req, res){
		res.render('mainPage', { user: req.user });
	});


	router.get('/applyChef', function(req, res){
		res.render('applyChef', { layout: "layout.hbs", user: req.user });
	});

	router.get('/applyChefSubmitted', function(req, res){
		res.render('applyChefSubmitted', { layout: "layout.hbs", user: req.user });
	});

	router.post('/chefSignup', function (req, res) {
		transporter.sendMail({
			from: 'zhengff41@gmail.com',
			to: 'zhengff41@gmail.com',
			subject: chefApplicationGenerator.getTitle(req),
			text: chefApplicationGenerator.getContent(req),
		}, function(err){
			if(err) {
				console.error('Unable to send email: ' + err);
				// TODO (zhenlily): show proper msg for retry
				return;
			}
		});

		res.redirect(303, '/applyChefSubmitted');
	});

	router.get('/chefMain', function (req, res) {
		res.render('chefViewMainPage', { layout: "layout.hbs", user: req.user });
	});

	router.get('/chefDaily', function (req, res) {
		res.render('chefDailySetup', { layout: "layout.hbs", user: req.user });
	});

	/*Admin handlers*/ 
	router.get('/admin', function(req, res) {
    	// Display the Login page with any flash message, if any
		res.render('adminLogin');
	});

	router.post('/admin', passport.authenticate('adminlogin', {
		successRedirect: '/adminPanel',
		failureRedirect: '/admin',
		failureFlash: true
	}));

	router.get('/adminPanel', function(req, res) {
		res.render('adminPanel', {layout: "adminLayout.hbs",});
	});

	router.get('/cheflist', isAuthenticatedAdmin, function(req, res){
		res.render('cheflist', { layout: "adminLayout.hbs", user: req.user });
	});

	router.get('/createNewChef', isAuthenticatedAdmin, function(req, res){
		res.render('createNewChef', { layout: "adminLayout.hbs", user: req.user });
	});




	/* Handle Logout */
	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	return router;
}