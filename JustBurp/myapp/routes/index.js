var express = require('express');
var router = express.Router();

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

module.exports = function(passport){
	/* GET login page. */
	router.get('/', function(req, res) {
    // Display the Login page with any flash message, if any

		if (req.isAuthenticated()) {
			res.render('index', { layout: "layout.hbs", message: req.flash('message'),
									login: 'true'});
		} else {
			res.render('index', { layout: "layout.hbs", message: req.flash('message')});
			console.log("Have not log in");
		}

	});

	// /* Handle Login POST */
	// router.post('/login', passport.authenticate('login', {
	// 	successRedirect: '/',
	// 	failureRedirect: '/',
	// 	failureFlash: true
	// }));

	router.post('/login', function(req, res, next) {
	  // generate the authenticate method and pass the req/res
		var link = req.body.link;
	  passport.authenticate('login', function(err, user, info) {
	    if (err) { return next(err); }
	    if (!user) {
				console.log("could not signin");
				return res.redirect('/');
			}

			req.logIn(user, function(err) {
					if (err) { return next(err); }
					return res.redirect(link);
			});

	  })(req, res, next);
	});


	/* Handle Registration POST */
	router.post('/signup', passport.authenticate('signup', {
		successRedirect: '/mainPage',
		failureRedirect: '/',
		failureFlash: true
	}));


	/* GET Home Page */
	router.get('/lets-eat', function(req, res){
		if (req.isAuthenticated()) {
			res.render('lets-eat', { layout: "general-user-layout.hbs", message: req.flash('message'),
									login: 'true'});
		} else {
			res.render('lets-eat', { layout: "general-user-layout.hbs", message: req.flash('message')});
		}
	});

	router.post('/lets-eat', function(req, res){
		console.log("address: ", req.body.address);
		if (req.isAuthenticated()) {
			res.render('lets-eat', { layout: "general-user-layout.hbs", message: req.flash('message'),
									login: 'true'});
		} else {
			res.render('lets-eat', { layout: "general-user-layout.hbs", message: req.flash('message')});
		}
	});


	router.get('/applyChef', isAuthenticated, function(req, res){
		res.render('applyChef', { user: req.user });
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
