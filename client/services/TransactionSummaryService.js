import moment from 'moment';
import CommonService from './CommonService';
import TransactionSummary from '../models/TransactionSummary';
import { BigNumber } from 'bignumber.js';

export class TransactionSummaryService {

    getTransactionSummaries(transactions) {

        var self = this;

        return new Promise(function (resolve, reject) {

            var summaries = [];
            var uniqueCurrencies = CommonService.getUniqueCurrencies(transactions);

            uniqueCurrencies.forEach(currency => {

                var summary = new TransactionSummary();
                summary.currency = currency;

                var matches = self.getTransactionsForCurrency(transactions, currency);

                var t = matches[0];

                summary.totalAmount = t.amount;
                //summary.totalAmount = self.getTransactionsTotalAmount(matches);

                //Convert ALL as if they were purchased in BTC                                
                summary.purchaseCurrency = t.purchaseCurrency;
                //summary.purchaseCurrency = "BTC";
                
                summary.averagePurchaseUnitPrice = t.purchaseUnitPrice
                summary.averagedExchangeRates = t.exchangeRates;

                summaries.push(summary);
            });

            // summaries.sort((s1, s2) => {
            //     return s1.
            // })

            resolve(summaries);
        });
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

        var total = 0;
        
        transactions.forEach(t => {
            
            if(t.purchaseCurrency == fromSymbol)
                total += t.purchaseUnitPrice;
            else
                total += this.getExchangeRate(t, fromSymbol);
        });

        return new BigNumber(total).dividedBy(transactions.length).toNumber();
    }

    getExchangeRate(transaction, currency) {

        var rate = transaction.exchangeRates.rates.find(r => {
            return r.symbol == currency;
        })

        if(!rate)
            return 0;

        return rate.rate;
    }


}

export default TransactionSummaryService;