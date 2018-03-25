import moment from 'moment';
import CommonService from './CommonService';
import TransactionSummary from '../models/TransactionSummary';
import { BigNumber } from 'bignumber.js';

export class TransactionSummaryService {

    getTransactionSummaries(transactions, fiats, coins, priceIndex) {

        var self = this;

        return new Promise(function (resolve, reject) {

            var summaries = [];
            var uniqueCurrencies = CommonService.getUniqueCurrencies(transactions);
            var allCurrencies = self.mergeCurrencies(fiats, coins); //This is a FULL list of all currencies

            uniqueCurrencies.forEach(currency => {

                var summary = new TransactionSummary();
                summary.currency = currency;

                var matches = self.getTransactionsForCurrency(transactions, currency);

                summary.totalAmount = self.getTransactionsTotalAmount(matches);

                //Convert ALL as if they were purchased in BTC                                
                summary.purchaseCurrency = "BTC";

                var exchangeRates = {
                    fromSymbol: currency,
                    rates: []
                }

                allCurrencies.forEach(c => {

                    var averageUnitPrice = self.getAveragePurchaseUnitPrice(c, matches);

                    if (c == summary.purchaseCurrency) {
                        summary.averagePurchaseUnitPrice = averageUnitPrice;

                        summary.btcValue = self.getCurrentPriceInBtc(summary.currency, priceIndex) * summary.totalAmount; //Only really need this for ordering..
                    }
                    else {
                        var rate = {
                            symbol: c,
                            rate: averageUnitPrice
                        }
                        exchangeRates.rates.push(rate);
                    }
                });

                summary.averagedExchangeRates = exchangeRates;

                summaries.push(summary);
            });

            summaries.sort((s1, s2) => {
                return s1.btcValue < s2.btcValue;
            })

            resolve(summaries);
        });
    }

    mergeCurrencies(fiats, coins) {
        fiats = fiats.map(f => f.symbol);
        coins = coins.map(c => c.symbol);
        return fiats.concat(coins);
    }

    getTransactionsForCurrency(transactions, currency) {

        return transactions.filter(t => {
            return t.currency == currency;
        });

    }

    getTransactionsTotalAmount(transactions) {
        var total = 0;
        transactions.forEach(t => {
            var balance = CommonService.getTransactionAmountBalance(t);
            total += balance;
        });
        return total;
    }

    getAveragePurchaseUnitPrice(fromSymbol, transactions) {

        var totalUnitPrice = new BigNumber(0);
        var totalAmount = new BigNumber(0);

        transactions.forEach(t => {

            var amount = new BigNumber(t.amount.toString());
            totalAmount = totalAmount.plus(amount);

            var unitPrice;
            if (t.purchaseCurrency == fromSymbol)
                unitPrice = new BigNumber(t.purchaseUnitPrice.toString());
            else
                unitPrice = new BigNumber(this.getExchangeRate(t, fromSymbol).toString());

            totalUnitPrice = totalUnitPrice.plus(unitPrice.multipliedBy(amount)); //weighted average
        });

        return new BigNumber(totalUnitPrice).dividedBy(totalAmount).toNumber();
    }

    getExchangeRate(transaction, currency) {

        var rate = transaction.exchangeRates.rates.find(r => {
            return r.symbol == currency;
        })

        if (!rate)
            return 0;

        return rate.rate;
    }

    getCurrentPriceInBtc(targetSymbol, priceIndex) {
        if (!priceIndex || !priceIndex['BTC'])
            return 0;
        return this.invertExchange(priceIndex['BTC'][targetSymbol]);
    }

    invertExchange(value) {
        if (value == null)
            return 0;
        return new BigNumber(1).dividedBy(value).toNumber();
    }

}

export default TransactionSummaryService;