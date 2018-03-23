
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
        if (tSyms.indexOf(fromSymbol) != -1)
            tSyms.splice(tSyms.indexOf(fromSymbol), 1);

        //console.log('fromSymbol: ', fromSymbol);
        //console.log('tSyms: ', tSyms);

        return new Promise(function (resolve, reject) {

            self.getPricehistorical(fromSymbol, tSyms, date)
                .then((rates) => {

                    var exchangeRates = {
                        fromSymbol: fromSymbol,
                        rates: []
                    }

                    for (var symbol in rates) {

                        if (rates.hasOwnProperty(symbol)) {
                            exchangeRates.rates.push({
                                symbol: symbol,
                                rate: rates[symbol]
                            })
                        }
                    }

                    //console.log('##########################################');
                    //console.log('Original Rates: ', exchangeRates);
                    //console.log('##########################################');
                    self.checkExchangeRates(toSymbol, toRate, date, exchangeRates.rates, [],
                        (ratesOut) => {
                            exchangeRates.rates = ratesOut;
                            resolve(exchangeRates);
                        })
                });
        });
    }

    checkExchangeRates(toSymbol, toRate, date, ratesIn, ratesOut, resolve) {

        var self = this;

        if (ratesIn.length == 0) {
            resolve(ratesOut);
            return;
        }

        var rate = ratesIn.pop();

        if (rate.rate != 0) {
            //console.log('*********************************')
            //console.log('Have rate: ', rate);
            ratesOut.push(rate);
            //console.log('*********************************')
            self.checkExchangeRates(toSymbol, toRate, date, ratesIn, ratesOut, resolve);
        }
        else {

            //First BTC exchange
            self.exchange('BTC', [toSymbol], date)
                .then(btcExchangeRate => {

                    //console.log('=======================================')
                    //console.log('1. ------------------------------------')

                    //No btc conversion, nothing we can do
                    if (btcExchangeRate == 0) {
                        //console.log('No btc conversion, nothing we can do')
                        ratesOut.push(rate);
                        self.checkExchangeRates(toSymbol, toRate, date, ratesIn, ratesOut, resolve);
                        return;
                    }


                    //console.log('BTC' + ' -> ' + toSymbol)
                    //console.log('btcExchangeRate -> ' + btcExchangeRate)
                    //console.log('toRate -> ' + toRate)

                    var ex1 = btcExchangeRate / toRate;

                    //console.log('ex1 -> ' + ex1)

                    //Now convert to exchange we actually need
                    self.exchange('BTC', [rate.symbol], date)
                        .then(finalExchangeRate => {

                            //console.log('2. ------------------------------------')

                            //No btc conversion, nothing we can do
                            if (finalExchangeRate == 0) {
                                //console.log('No btc conversion, nothing we can do')
                                ratesOut.push(rate);
                                self.checkExchangeRates(toSymbol, toRate, date, ratesIn, ratesOut, resolve);
                                return;
                            }

                            //console.log('BTC' + ' -> ' + rate.symbol)
                            //console.log('ex1 -> ' + ex1)
                            //console.log('finalExchangeRate -> ' + finalExchangeRate)
                            //console.log('Orginal: ' + rate.rate)

                            rate.rate = (finalExchangeRate / ex1);

                            //console.log('New: ' + rate.rate);

                            ratesOut.push(rate);
                            self.checkExchangeRates(toSymbol, toRate, date, ratesIn, ratesOut, resolve);

                        });
                })
        }
    }

    exchange(fromSym, toSym, date) {

        var self = this;

        return new Promise(function (resolve, reject) {

            self.getPricehistorical(fromSym, [toSym], date)
                .then((rates) => {
                    resolve(rates[toSym]);
                });
        });
    }

    getPricehistorical(fromSymbol, tSyms, date) {

        var self = this;

        return new Promise(function (resolve, reject) {
            self.getPricehistoricalInternal(fromSymbol, tSyms, date, { },
                (rates) => {
                    resolve(rates);
                });
        });
    }

    getPricehistoricalInternal(fromSymbol, tSyms, date, rates, completeCallback) {

        var self = this;

        if(tSyms.length == 0) {
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
                self.getPricehistoricalInternal(fromSymbol, tSyms, date, rates, completeCallback)
            });
    }
}

module.exports = TransactionRepository;