import { observable, action, computed } from 'mobx';
import { inject, observer } from 'mobx-react';
import agentExt from '../agent-ext';
import moment from 'moment';

export class PortfolioChartStore {

    getData(transactions) {

        var self = this;

        return new Promise(function (resolve, reject) {

            if (transactions.length == 0) {
                resolve({});
                return;
            }

            var limit = self.getLimit(transactions);
            var inCurrencies = self.getUniqueInCurrencies(transactions);

            self.getHistoricalValues(transactions, 'BTC', 'USD', limit)
                .then(values => {

                    var labels = values.map(v => {
                        return v.date;
                    });

                    var totals = values.map(v => {
                        return v.total;
                    })

                    resolve({
                        labels: labels,
                        datasets: [{
                            label: 'USD',
                            data: totals,
                            borderWidth: 2,
                            fill: false,
                            pointRadius: 0,
                            borderColor: 'rgba(0, 123, 255, 0.8)'
                        }]
                    });

                });

        });
    }

    //How many days to go back
    getLimit(transactions) {

        //return 180; //6 months

        //get the first transaction
        var transaction = transactions[0];

        var firstDate = moment(transaction.date);
        var now = moment();

        var duration = moment.duration(now.diff(firstDate));
        return Math.ceil(duration.asDays());
    }

    getUniqueInCurrencies(transactions) {
        var currencies = transactions.map(t => {
            return t.in_currency;
        })
        return currencies.filter(this.unique);
    }

    unique(value, index, self) { 
        return self.indexOf(value) === index;
    }

    getHistoricalValues(transactions, fromCurrency, toCurrency, limit) {

        return new Promise(function (resolve, reject) {

            agentExt.External.getDailyHistoricalPrice(fromCurrency, toCurrency, limit)
                .then(dailyData => {

                    var amount = 0;
                    var values = [];

                    dailyData.forEach(d => {

                        //See if we have a transaction for this day
                        var dDate = moment.unix(d.time).utc().format('YYYY-MM-DD');

                        var grouped = {
                            date: dDate,
                            amount: amount,
                            total: 0
                        }

                        transactions.filter(t => {

                            if (t.date.indexOf(dDate) == 0) {
                                amount += t.in_amount;
                                grouped.amount = amount;
                            }
                        });

                        grouped.total = amount * d.close

                        values.push(grouped);
                    });

                    resolve(values);
                });
        });
    }
}

export default new PortfolioChartStore();