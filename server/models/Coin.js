
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var coinSchema = new Schema({
    name: String,
    symbol: String,
    cmc_rank: Number,
    cmc_id: Number,
    logoUrl_32x32: String,
    logoBase62_32x32: String,
    twitterUrl: String,
    redditUrl: String
});

module.exports = mongoose.model('Coin', coinSchema);