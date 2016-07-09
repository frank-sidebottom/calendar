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
//HERE!!!!!!!!!+++++++++++++++++++
router.get('/calendarevents/:name', function(req, res) {
	var calName = req.params.name;
	if (calName != null){
		var newModel = mongoose.model(calName, Calendarevent.schema);
			newModel.find({}, function(err, calendarEvents){
		//console.log(calendarEvents + " :calendar");
			res.send(calendarEvents);
		});
	};


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


//!!!!Dynamic Calendars are possible!!!NEXT ADD THIS DYNAMIC FUNC TO /calendarevents route
router.post('/addevent', function(req, res){
	var calName = req.body.calendar;
	if (calName != null){
		var newModel = mongoose.model(calName, Calendarevent.schema);
		newModel.create(req.body, function(err, event){
			if (err) return handleError(err);
		})
	}
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
	//console.log(req.body);
	//console.log(req.body.userSelect + '.........' + req.body.calendarsSelect);
	UserList.findOne({username: req.body.userSelect}, function(err, doc){

		if (err) console.log('error finding document');

		//console.log("Document: " + doc);

		//clear all currently assigned dbs
		doc.accessibleDbs = [];
		doc.save();

		for(i = 0; i < req.body.calendarsSelect.length; i++){


			doc.accessibleDbs.push(req.body.calendarsSelect[i]);

			//doc.save(console.log(doc + ' Success'));
			//console.log("accessible Dbs: " + doc.accessibleDbs);
		}
		//console.log("Document post addition: " + doc);
		doc.save();
	});

});


router.put('/editevent', function(req, res) {
	console.log(req.body);
	var eventDat = req.body.newData;
	console.log('eventDat: ' + eventDat);
	if(eventDat != null){
		console.log('Datum is not null');
		var eventObject = JSON.parse(req.body.event);
		console.log(eventObject);
		var calName = eventObject.calendar;
		var newModel = mongoose.model(calName, Calendarevent.schema);
		newModel.findById(eventObject._id, function(err, doc){
			//console.log('in the findById');
			//this won't work
			var eventParam = req.body.eventParam;
			//console.log('eventParam: ');
			//console.log(eventParam);
			//doc.eventParam = eventDat;
			//console.log('doc.eventParam :');
			//console.log(doc.eventParam);
			doc.set(eventParam, eventDat);
			doc.save();
			//console.log('doc: ');
			//console.log(doc);
			
			if (err) console.log('error: ' + err);
		});
		//var query = { _id : eventObject._id };
		//newModel.update(query, { eventParam: eventDat}, options, callback);

	res.send('fuck');	

	}

//!!!!!How do I do this again?


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
