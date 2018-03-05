var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  picture: String,
  googleId: String
});

module.exports = mongoose.model('User', userSchema);