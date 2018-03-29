var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var settingScheme = new Schema({
  name: String,
  value: String
});

var userSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  picture: String,
  googleId: String,
  settings: [settingScheme]
});

module.exports = mongoose.model('User', userSchema);