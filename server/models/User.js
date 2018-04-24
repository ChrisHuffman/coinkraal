let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let settingScheme = new Schema({
  name: String,
  value: String
});

let userSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  picture: String,
  googleId: String,
  facebookId: String,
  dateCreated: Date,
  lastLogin: Date,
  settings: [settingScheme]
});

module.exports = mongoose.model('User', userSchema);