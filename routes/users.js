var express = require('express');
var router = express.Router();
var Calendarevent = require('../models/Calendarevent');
var UserList = require('../models/user');
var mongoose = require('mongoose');
var circular = require('circular');

//console.log(Calendarevent);

/*
 * GET userlist.
 */

router.get('/calendarevents', function(req, res) {
	Calendarevent.find({}, function(err, calendarEvents){
		//console.log(calendarEvents + " :calendar");
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
//!!!!Dynamic Calendars are possible!!!
router.post('/addevent', function(req, res){
	var newModel = mongoose.model('newCal', Calendarevent.schema);
	newModel.create(req.body, function(err, event){
		if (err) return handleError(err);
	})
});

router.get('/userlist', function(req, res){
	UserList.find({}, function(err, users){
		res.send(users);
	})
});


router.get('/collectionslist', function(req, res){
	//console.log('collectionslist route called');
	var database = mongoose.createConnection('mongodb://localhost/cal2');
	database.once('open', function (ref) {
	//console.log('database opened');
	   database.db.collections(function (err, names) {
	        //console.log("names: " + names); // [{ name: 'dbname.myCollection' }]
	        var str = JSON.stringify(names, circular());
	        //console.log(str);
	        
	       	res.send(str);
	        //module.exports.Collection = names;
	    });
	})

		
})



router.put('/updateUserCalendars/', function(req, res){
	console.log(req.body);
	console.log(req.body.userSelect + '.........' + req.body.calendarsSelect);
	UserList.findOne({username: req.body.userSelect}, function(err, doc){

		if (err) console.log('error finding document');

		console.log("Document: " + doc);

		//clear all currently assigned dbs
		doc.accessibleDbs = [];
		doc.save();

		for(i = 0; i < req.body.calendarsSelect.length; i++){


			doc.accessibleDbs.push(req.body.calendarsSelect[i]);

			//doc.save(console.log(doc + ' Success'));
			console.log("accessible Dbs: " + doc.accessibleDbs);
		}
		console.log("Document post addition: " + doc);
		doc.save();
	});

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
