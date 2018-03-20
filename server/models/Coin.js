
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var linkScheme = new Schema({
    name: String,
    url: String
});

var coinSchema = new Schema({
    name: String,
    symbol: String,
    logoUrl_32x32: String,
    logoBase62_32x32: String,
    links: [linkScheme]
});

module.exports = mongoose.model('Coin', coinSchema);