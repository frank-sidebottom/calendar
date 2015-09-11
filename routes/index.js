var express = require('express');
var router = express.Router();
var UserList = require('../models/user')

var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/');
}

var isAdmin = function(req, res, next) {
  if (req.user.username == 'Fractal')
    return next();

  res.redirect('/');
}

module.exports = function(passport){
 
  /* GET login page. */
  router.get('/', function(req, res) {
    // Display the Login page with any flash message, if any
    res.render('index', { message: req.flash('message') });
  });

 
	/* GET Home Page */
	router.get('/home', isAuthenticated, function(req, res){
		res.render('home', { 
			user: req.user
			 });
	});

  /* GET Admin page */
  router.get('/admin', isAuthenticated, isAdmin, function(req, res){
    res.render('admin');
  })

 
  /* Handle Login POST */
  router.post('/login', passport.authenticate('login', {
    successRedirect: '/home',
    failureRedirect: '/',
    failureFlash : true 
  }));
 
  /* GET Registration Page */
  router.get('/signup', function(req, res){
    res.render('register',{message: req.flash('message')});
  });
 
  /* Handle Registration POST */
  router.post('/signup', passport.authenticate('signup', {
    successRedirect: '/home',
    failureRedirect: '/signup',
    failureFlash : true 
  }));

  //Fetch calendars for display
  router.get('/calendars', function(req, res){
    var userLoadCalendars = req.user.username;
    UserList.findOne({username: req.user.username}, function(err, doc){
      if (err) console.log('error finding document');
      console.log('/calendars route accessibleDbs: ' + doc.accessibleDbs);
      res.send(doc.accessibleDbs);
    })
  })

  /* Handle Logout */
router.get('/signout', function(req, res) {
  req.logout();
  res.redirect('/');
});
 
  return router;
}