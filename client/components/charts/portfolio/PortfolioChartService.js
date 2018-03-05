import { observable, action, computed } from 'mobx';
import { inject, observer } from 'mobx-react';
import agentExt from '../../../agent-ext';
import moment from 'moment';
import DataPoint from './DataPoint';

export class PortfolioChartService {

    getData(transactions) {

        var self = this;

        return new Promise(function (resolve, reject) {

            if (transactions.length == 0) {
                resolve({
                    labels: [],
                    datasets: []
                });
                return;
            }

            var limit = self.getLimit(transactions);
            var inCurrencies = self.getUniqueInCurrencies(transactions);

            var fromCurrency = "BTC";

            console.log('Starting to load chart data..')

            agentExt.External.getDailyHistoricalPrice(fromCurrency, 'USD', limit)
                .then(dailyData => {
                   

                    var coinCount = 0;
                    var previousAmount = 0;
                    var dataPoints = {};

                    dailyData.forEach(d => {

                        var date = moment.unix(d.time).utc().format('YYYY-MM-DD');

                        var dataPoint = dataPoints[d.time];

                        if(!dataPoint) {
                            dataPoint = new DataPoint(date, d);
                            dataPoints[d.time] = dataPoint;
                        }

                        dataPoint.setPrice(fromCurrency, d.close);
                        dataPoint.setStartingAmount(fromCurrency, previousAmount)

                        var matches = self.getTransactions(transactions, date, fromCurrency);

                        matches.forEach((t) => {
                            dataPoint.addTransaction(t);
                        })

                        previousAmount = dataPoint.amounts[fromCurrency];
                    });
                    return dataPoints;
                })
                .then((dataPoints) => {
                    
                    var dataPointsArray = [];

                    for (var time in dataPoints) {
                        if (dataPoints.hasOwnProperty(time)) {
                            dataPointsArray.push(dataPoints[time]);
                        }
                    }

                    var labels = dataPointsArray.map(dp => {
                        return dp.date;
                    });

                    var totals = dataPointsArray.map(dp => {
                        return dp.getTotal();
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

                    console.log('Load chart data end')
                });
        });
    }

    //How many days to go back
    getLimit(transactions) {

        //return 1000; 

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

    getTransactions(transactions, date, currency) {

        return transactions.filter(t => {
            return (t.date.indexOf(date) == 0 && t.in_currency == currency);
        });
    }
}

export default new PortfolioChartService();