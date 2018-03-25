
const superagent = require('superagent');
var moment = require('moment');
var BigNumber = require('bignumber.js');

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
                .sort({ date: 'desc' })
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

                    self.getExchangeRates(transaction.currency, sale.date, sale.saleCurrency, sale.saleUnitPrice)
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

                    self.getExchangeRates(transaction.currency, sale.date, sale.saleCurrency, sale.saleUnitPrice)
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

    getExchangeRates(fromSymbol, date, toSymbol, toRate) {

        var self = this;

        if (!fromSymbol || !date)
            return {};

        //Most probably want to add this to the config...
        var tSyms = ["USD", "ZAR", "EUR", "GBP", "AUD", "BTC", "ETH", "NEO"];

        //Take out same symbol
        //if (tSyms.indexOf(fromSymbol) != -1)
            //tSyms.splice(tSyms.indexOf(fromSymbol), 1);

        var exchangeRates = {
            fromSymbol: fromSymbol,
            rates: []
        }

        tSyms.forEach(s => {
            exchangeRates.rates.push({
                symbol: s,
                rate: 0
            })
        });

        return new Promise(function (resolve, reject) {

            self.exchange('BTC', [toSymbol], date)
                .then(btcExchangeRate => {

                    if (btcExchangeRate == 0) {
                        //console.log('No btc conversion, nothing we can do')
                        resolve([]);
                        return;
                    }

                    self.checkExchangeRates(fromSymbol, toSymbol, toRate, btcExchangeRate, date, exchangeRates.rates, [],
                        (ratesOut) => {
                            exchangeRates.rates = ratesOut;
                            resolve(exchangeRates);
                        })
                });
        });
    }

    checkExchangeRates(fromSymbol, toSymbol, toRate, btcExchangeRate, date, ratesIn, ratesOut, resolve) {

        var self = this;

        if (ratesIn.length == 0) {
            resolve(ratesOut);
            return;
        }

        var rate = ratesIn.pop();

        //console.log('=======================================')

        //Apply weighting
        var weighting = new BigNumber(btcExchangeRate.toString()).dividedBy(toRate);

        //console.log('ex1 -> ' + ex1)

        //Now convert to exchange we actually 
        var baseCurrency = 'BTC';

        self.exchange(baseCurrency, [rate.symbol], date)
            .then(finalExchangeRate => {

                //console.log('2. ------------------------------------')

                //No btc conversion, nothing we can do
                if (finalExchangeRate == 0) {
                    //console.log('No btc conversion, nothing we can do')
                    //ratesOut.push(rate);
                    self.checkExchangeRates(fromSymbol, toSymbol, toRate, btcExchangeRate, date, ratesIn, ratesOut, resolve);
                    return;
                }

                //console.log('From' + ' -> ' + fromSymbol)
                //console.log('To' + ' -> ' + rate.symbol)
                //console.log('Weighting -> ' + weighting)
                //console.log('FinalExchangeRate -> ' + finalExchangeRate)

                if(fromSymbol == rate.symbol)
                    rate.rate = 1;
                else
                    rate.rate = new BigNumber(finalExchangeRate.toString()).dividedBy(weighting).toNumber();

                //console.log('Final: ' + rate.rate);
                
                ratesOut.push(rate);
                self.checkExchangeRates(fromSymbol, toSymbol, toRate, btcExchangeRate, date, ratesIn, ratesOut, resolve);
            });
    }

    exchange(fromSym, toSym, date) {

        var self = this;

        return new Promise(function (resolve, reject) {

            if(fromSym == toSym) {
                resolve(1);
                return;
            }

            self.getPricehistorical(fromSym, [toSym], date)
                .then((rates) => {
                    resolve(rates[toSym]);
                });
        });
    }

    getPricehistorical(fromSymbol, tSyms, date) {

        var self = this;

        return new Promise(function (resolve, reject) {
            self.getPricehistoricalRecurse(fromSymbol, tSyms, date, {},
                (rates) => {
                    resolve(rates);
                });
        });
    }

    getPricehistoricalRecurse(fromSymbol, tSyms, date, rates, completeCallback) {

        var self = this;

        if (tSyms.length == 0) {
            completeCallback(rates)
            return;
        }

        var query = {
            fsym: fromSymbol,
            tsyms: tSyms.splice(0, 7).join(), //Max 7 at a time
            ts: moment(date).unix(),
            calculationType: 'MidHighLow'
        }

        return superagent.get('https://min-api.cryptocompare.com/data/pricehistorical')
            .query(query)
            .end((err, resp) => {
                if (err) {
                    reject();
                    return;
                };

                rates = Object.assign(rates, resp.body[fromSymbol]);
                self.getPricehistoricalRecurse(fromSymbol, tSyms, date, rates, completeCallback)
            });
    }
}

module.exports = TransactionRepository;