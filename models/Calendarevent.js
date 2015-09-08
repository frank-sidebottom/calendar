var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Calendarevent = new Schema({
  title: String,
  start: String,
  end: String,
  description: String,
  tags: String,
  urlTrackingurl: String,
  isDrivingTo: String,
  notes: String
});
//move this to a route on index.js, make model module.exports and 
//use an ajax posted var to pick the db.
//List of available dbs is a user var, and admins have access to all vars
module.exports = mongoose.model('Calendarevent', Calendarevent);