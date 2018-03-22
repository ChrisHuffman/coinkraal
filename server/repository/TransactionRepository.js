
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

            self.getExchangeRates(transaction.currency, transaction.date, transaction.purchaseCurrency, transaction.purchaseUnitPrice)
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

                    self.getExchangeRates(transaction.currency, transaction.date, transaction.purchaseCurrency, transaction.purchaseUnitPrice)
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

                    self.getExchangeRates(sale.saleCurrency, sale.date, sale.saleCurrency, sale.saleUnitPrice)
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

                    self.getExchangeRates(sale.saleCurrency, sale.date, sale.saleCurrency, sale.saleUnitPrice)
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

    getExchangeRates(fromSymbol, date, toSymbol, toPrice) {

        var self = this;

        if (!fromSymbol || !date)
            return {};

        //Most probably want to add this to the config...
        var tSyms = ["USD", "ZAR", "EUR", "GBP", "AUD", "BTC", "ETH", "NEO"];

        //Max 30 chars - take out same symbol
        tSyms.splice(tSyms.indexOf(fromSymbol), 1);

        return new Promise(function (resolve, reject) {

            self.getPricehistoricalApi(fromSymbol, tSyms, date)
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

    checkExchangeRates(toSymbol, toRate, exchangeRatesIn, exchangeRatesOut, resolve) {

        var self = this;

        if (exchangeRatesIn.length == 0) {
            resolve(exchangeRatesOut);
            return;
        }

        var rate = exchangeRatesIn.pop();

        if (rate.rate != 0) {
            exchangeRatesOut.push(rate);
            self.checkExchangeRates(toSymbol, toRate, exchangeRatesIn, exchangeRatesOut, resolve);
        }
        else {

            //First BTC exchange
            self.exchange('BTC', [toSymbol], date)
                .then(btcExchangeRate => {

                    var ex1 = btcExchangeRate / toRate;

                    //Now convert to exchange we actually need
                    self.exchange('BTC', rate.symbol, date)
                        .then(finalExchangeRate => {

                            rate.rate = ex1 / finalExchangeRate;

                            exchangeRatesOut.push(rate);
                            self.checkExchangeRates(toSymbol, toRate, exchangeRatesIn, exchangeRatesOut, resolve);

                        });
                })
        }
    }

    exchange(fromSym, toSym, date) {

        return new Promise(function (resolve, reject) {

            this.getPricehistoricalApi(fromSym, [toSym], date)
                .end((err, resp) => {
                    resolve(resp.body[fromSym][toSym]);
                });
        });
    }

    getPricehistoricalApi(fromSymbol, tSyms, date) {

        var query = {
            fsym: fromSymbol,
            tsyms: tSyms.join(),
            ts: moment(date).unix(),
            calculationType: 'MidHighLow'
        }

        return superagent.get('https://min-api.cryptocompare.com/data/pricehistorical').query(query);
    }
}

module.exports = TransactionRepository;