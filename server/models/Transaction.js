var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var transactionSchema = new Schema({
  userId: String,
  type: String,

  in_currency: String,
  in_amount: Number,
  in_unitPriceUSD: Number,

  out_currency: String,
  out_amount: Number,
  out_unitPriceUSD: Number,

  date: Date,
  exchange: String,
  notes: String
});

module.exports = mongoose.model('Transaction', transactionSchema);