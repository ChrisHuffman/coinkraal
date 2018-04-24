
let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let linkScheme = new Schema({
    name: String,
    url: String
});

let coinSchema = new Schema({
    name: String,
    symbol: String,
    logoUrl_32x32: String,
    logoBase62_32x32: String,
    links: [linkScheme]
});

module.exports = mongoose.model('Coin', coinSchema);