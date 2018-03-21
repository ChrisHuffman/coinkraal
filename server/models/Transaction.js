var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var rateScheme = new Schema({
  symbol: { type: String, required: true },
  rate: { type: Number,required: true }
});

var exchangeRatesScheme = new Schema({
  fromSymbol: {
    type: String,
    required: true
  },
  rates: [rateScheme]
});

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
  notes: String,

  exchangeRates: exchangeRatesScheme
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
    required: [true, 'Amount required'],
    validate: {
      validator: function (value) {

        var totalSales = 0;
        this.sales.forEach(sale => {
          totalSales += sale.amount;
        });

        if (totalSales > value)
          throw new Error(`Total sales of ${totalSales} ${this.currency} must be less than the transaction amount of ${value} ${this.currency}.`);

        return true;
      }
    }
  },
  purchaseCurrency: {
    type: String,
    required: [true, 'Purchased with required']
  },
  purchaseUnitPrice: {
    type: Number,
    required: [true, 'Unit Price required']
  },

  exchangeRates: exchangeRatesScheme,

  sales: [saleScheme]
});

module.exports = mongoose.model('Transaction', transactionSchema);