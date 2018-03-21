
const superagent = require('superagent');
var moment = require('moment');

var Transaction = require('../models/Transaction');

class TransactionRepository {

    getTransaction(transactionId) {

        return new Promise(function (resolve, reject) {

            Transaction.findOne({ _id: transactionId },
                function (error, transaction) {
                    if (error)
                        reject(error);
                    else
                        resolve(transaction);
                });
        })
    }

    getTransactions(userId) {

        return new Promise(function (resolve, reject) {

            Transaction.find({ userId: userId })
                .sort({ date: 'asc' })
                .exec(function (error, transactions) {
                    if (error)
                        reject(error);
                    else
                        resolve(transactions);
                });
        })
    }

    addTransaction(transaction) {

        var self = this;

        return new Promise(function (resolve, reject) {

            self.getExchangeRates(transaction.currency, transaction.date)
                .then((exchangeRates) => {

                    transaction.exchangeRates = exchangeRates;

                    transaction.save(function (err) {
                        if (err)
                            reject(err);
                        else
                            resolve();
                    });
                });
        });
    }

    updateTransaction(id, transaction) {

        var self = this;

        return new Promise(function (resolve, reject) {

            self.getTransaction(id)
                .then(toUpdate => {

                    toUpdate.date = transaction.date;
                    toUpdate.exchange = transaction.exchange;
                    toUpdate.notes = transaction.notes;
                    toUpdate.currency = transaction.currency;
                    toUpdate.amount = transaction.amount;
                    toUpdate.purchaseCurrency = transaction.purchaseCurrency;
                    toUpdate.purchaseUnitPrice = transaction.purchaseUnitPrice;

                    self.getExchangeRates(transaction.currency, transaction.date)
                        .then((exchangeRates) => {

                            toUpdate.exchangeRates = exchangeRates;

                            toUpdate.save(function (err) {
                                if (err)
                                    reject(err);
                                else
                                    resolve();
                            });
                        });
                });
        });
    }

    removeTransaction(transactionId) {

        return new Promise(function (resolve, reject) {

            Transaction.find({ _id: transactionId }).remove().exec(function (err, transaction) {
                if (err)
                    reject(err);
                else
                    resolve();
            })
        });
    }

    addSale(transactionId, sale) {

        var self = this;

        return new Promise(function (resolve, reject) {

            self.getTransaction(transactionId)
                .then(transaction => {

                    self.getExchangeRates(sale.saleCurrency, sale.date)
                        .then((exchangeRates) => {

                            sale.exchangeRates = exchangeRates;

                            transaction.sales.push(sale);

                            transaction.save(function (err) {
                                if (err)
                                    reject(err);
                                else
                                    resolve();
                            });
                        });
                })
        });
    }

    updateSale(transactionId, sale) {

        var self = this;

        return new Promise(function (resolve, reject) {

            self.getTransaction(transactionId)
                .then(transaction => {

                    var toUpdate = transaction.sales.id(sale._id);
                    toUpdate.date = sale.date;
                    toUpdate.amount = sale.amount;
                    toUpdate.saleCurrency = sale.saleCurrency;
                    toUpdate.saleUnitPrice = sale.saleUnitPrice;
                    toUpdate.notes = sale.notes;

                    self.getExchangeRates(sale.saleCurrency, sale.date)
                        .then((exchangeRates) => {

                            toUpdate.exchangeRates = exchangeRates;

                            transaction.save(function (err) {
                                if (err)
                                    reject(err);
                                else
                                    resolve();
                            });

                        });

                })
        });
    }

    removeSale(saleId) {

        return new Promise(function (resolve, reject) {

            Transaction.findOne({ 'sales._id': saleId }, function (err, transaction) {
                if (err)
                    reject(err);
                else {
                    transaction.sales.id(saleId).remove()
                    transaction.save();
                    resolve();
                }
            })
        });
    }

    getExchangeRates(fromSymbol, date) {

        if (!fromSymbol || !date)
            return {};

        //Most probably want to add this to the config...
        var tSyms = "USD,ZAR,GBP,AUD,BTC,ETH,NEO";

        var query = {
            fsym: fromSymbol,
            tsyms: tSyms,
            ts: moment(date).unix(),
            calculationType: 'MidHighLow'
        }

        return new Promise(function (resolve, reject) {

            superagent.get('https://min-api.cryptocompare.com/data/pricehistorical')
                .query(query)
                .end((err, resp) => {
                    if (err) {
                        res.status(500).send('');
                        return;
                    };

                    var exchangeRates = {
                        fromSymbol: fromSymbol,
                        rates: []
                    }

                    var rates = resp.body[fromSymbol];
                    for (var symbol in rates) {
                        if (rates.hasOwnProperty(symbol)) {
                            exchangeRates.rates.push({
                                symbol: symbol,
                                rate: rates[symbol]
                            })
                        }
                    }

                    resolve(exchangeRates);
                });
        });
    }
}

module.exports = TransactionRepository;