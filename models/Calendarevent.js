var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Calendarevent = new Schema({
  title: String,
  start: String,
  end: String,
  description: String
});

module.exports = mongoose.model('Calendarevent', Calendarevent);