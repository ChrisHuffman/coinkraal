var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var saleScheme = new Schema({
  date: {
    type: Date,
    required: [true, 'Date required']
  },
  amount: {
    type: Number,
    required: [true, 'Amount required']
  },
  saleCurrency: {
    type: String,
    required: [true, 'Currency required']
  },
  saleUnitPrice: {
    type: Number,
    required: [true, 'Unit Price required']
  },
  notes: String
});

var transactionSchema = new Schema({
  userId: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: [true, 'Date required']
  },
  exchange: String,
  notes: String,

  currency: {
    type: String,
    required: [true, 'Currency required']
  },
  amount: {
    type: Number,
    required: [true, 'Amount required']
  },
  purchaseCurrency: {
    type: String,
    required: [true, 'Purchased with required']
  },
  purchaseUnitPrice: {
    type: Number,
    required: [true, 'Unit Price required']
  },

  sales: [saleScheme]
});

module.exports = mongoose.model('Transaction', transactionSchema);