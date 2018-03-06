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

            console.log('Starting to load chart data..')


            self.loadDataPoints(self.getUniqueInCurrencies(transactions), "USD", transactions, limit)
                .then((dataPointsUSD) => {

                    self.loadDataPoints(self.getUniqueInCurrencies(transactions), "BTC", transactions, limit)
                        .then((dataPointsBTC) => {

                            var data = self.getChartJsData(dataPointsUSD, dataPointsBTC);

                            resolve(data);

                            console.log('Load chart data end')
                        })
                });
        });
    }

    loadDataPoints(inCurrencies, toCurrency, transactions, limit) {

        var self = this;
        var dataPoints = {};

        return new Promise(function (resolve, reject) {

            self.loadDataPointsForCurrency(inCurrencies, toCurrency, dataPoints, transactions, limit, resolve);
        });
    }

    loadDataPointsForCurrency(inCurrencies, toCurrency, dataPoints, transactions, limit, resolve) {

        var self = this;

        if(inCurrencies.length == 0)
        {
            //console.log(dataPoints);
            resolve(dataPoints);
            return;
        }

        var fromCurrency = inCurrencies.pop()

        console.log('loading: ' + fromCurrency + "," + toCurrency);

        agentExt.External.getDailyHistoricalPrice(fromCurrency, toCurrency, limit)
            .then(dailyData => {

                var coinCount = 0;
                var previousAmount = 0;

                dailyData.forEach(d => {

                    var date = moment.unix(d.time).utc().format('YYYY-MM-DD');

                    var dataPoint = dataPoints[d.time];

                    if (!dataPoint) {
                        dataPoint = new DataPoint(date);
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

                //Load up next currencies data
                self.loadDataPointsForCurrency(inCurrencies, toCurrency, dataPoints, transactions, limit, resolve);
            })
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

    getChartJsData(dataPoints1, dataPoints2) {

        var arr1 = this.objectToArray(dataPoints1);
        var arr2 = this.objectToArray(dataPoints2);

        var labels = arr1.map(dp => {
            return dp.date;
        });

        return {
            labels: labels,
            datasets: [
                this.getChartJsDataset(arr1, "USD", "#28a745", "y-axis-1"),
                this.getChartJsDataset(arr2, "BTC", "#fd7e14", "y-axis-2")
            ]
        };
    }

    getChartJsDataset(dataPoints, label, borderColor, yAxisId) {

        var arr = this.objectToArray(dataPoints);

        var totals = arr.map(dp => {
            return dp.getTotal();
        })

        return {
            label: label,
            data: totals,
            borderWidth: 1,
            fill: false,
            pointRadius: 0,
            borderColor: borderColor,
            yAxisID: yAxisId
            //borderColor: 'rgba(0, 123, 255, 0.8)'
        };
    }

    objectToArray(obj) {
        var arr = [];
        for (var k in obj) {
            if (obj.hasOwnProperty(k)) {
                arr.push(obj[k]);
            }
        }
        return arr;
    }
}

export default new PortfolioChartService();