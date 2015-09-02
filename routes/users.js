var express = require('express');
var router = express.Router();
var Calendarevent = require('../models/Calendarevent');
//console.log(Calendarevent);

/*
 * GET userlist.
 */

router.get('/calendarevents', function(req, res) {
	Calendarevent.find({}, function(err, calendarEvents){
		console.log(calendarEvents + " :calendar");
		res.send(calendarEvents);
	});
	//Test Event
	// var testEvent = new Calendarevent ({
	// 	title: "Test Event",
	// 	start: "2015-09-04",
	// 	end: "2015-10-10",
	// 	description: "Hello, this is a description"
	// });
	// testEvent.save(function(err){
	// 	if (err) return handleError(err);
	// 	else console.log("Fuck you");
	// });
});

/*
 * Post to adduser
 

 router.post('/adduser', function(req, res){
 	var db = req.db;
 	var collection = db.get('userlist');
 	collection.insert(req.body, function(err, result){
 		res.send(
 			(err === null) ? { msg: ''} : {msg: err}
 			);
 	});
 });
 */
 /*
 * DELETE to deleteuser.


 router.delete('/deleteuser/:id', function(req, res){
 	var db = req.db;
 	var collection = db.get('userlist');
 	var userToDelete = req.params.id;
 	collection.remove({'_id' : userToDelete}, function(err) {
 		res.send((err === null) ? { msg: ''} : { msg: 'error: ' + err});
 	});
 });
 */
module.exports = router;
