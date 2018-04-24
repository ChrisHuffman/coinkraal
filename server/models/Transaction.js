let mongoose = require('mongoose');
let moment = require('moment');

let Schema = mongoose.Schema;

let rateScheme = new Schema({
  symbol: { type: String, required: true },
  rate: { type: Number,required: true }
});

let exchangeRatesScheme = new Schema({
  fromSymbol: {
    type: String,
    required: true
  },
  rates: [rateScheme]
});

let saleScheme = new Schema({
  date: {
    type: Date,
    required: [true, 'Date required']
  },
  amount: {
    type: Number,
    required: [true, 'Amount required'],
    min: [0, 'Amount cant be less than 0']
  },
  saleCurrency: {
    type: String,
    required: [true, 'Currency required']
  },
  saleUnitPrice: {
    type: Number,
    required: [true, 'Price required'],
    min: [0, 'Price cant be less than 0']
  },
  notes: String,

  exchangeRates: exchangeRatesScheme
});

let transactionSchema = new Schema({
  userId: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: [true, 'Date required'],
    validate: {
      validator: function (value) {

        this.sales.forEach(sale => {
          if (moment(sale.date).isBefore(value, 'day'))
            throw new Error(`Sale dates must come after the transaction date of ${moment(value).format('LL')}.`);
        });

        return true;
      }
    }
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
    min: [0, 'Amount cant be less than 0'],
    validate: {
      validator: function (value) {

        let totalSales = 0;
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
    required: [true, 'Price required'],
    min: [0, 'Price cant be less than 0']
  },

  exchangeRates: exchangeRatesScheme,

  sales: [saleScheme]
});

module.exports = mongoose.model('Transaction', transactionSchema);