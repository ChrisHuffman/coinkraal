import CommonService from './CommonService';
import moment from 'moment';
import PortfolioChartServiceDataPoint from '../models/PortfolioChartServiceDataPoint';

export class PortfolioChartService {

    getData(transactions, currency1, currency2, timeRange) {

        var self = this;

        return new Promise(function (resolve, reject) {

            if (transactions.length == 0) {
                resolve({
                    labels: [],
                    datasets: []
                });
                return;
            }

            var dataFrequencyLimit = 7;
            var dataFrequency = timeRange <= dataFrequencyLimit ? 'hours' : 'days';
            var limit = self.getLimit(transactions, dataFrequency);

            //We might have asked for 'Last Year' but if we only have transactions going 
            //back a few days then override the dataFrequency and set to hours 
            if (limit < dataFrequencyLimit && dataFrequency == 'days') {
                dataFrequency = 'hours';
                limit = self.getLimit(transactions, dataFrequency);
            }

            var inCurrencies = CommonService.getUniqueCurrencies(transactions);

            //console.log('Starting to load chart data..');

            self.loadDataPoints(CommonService.getUniqueCurrencies(transactions), currency1, transactions, limit, dataFrequency)
                .then((dataPoints1) => {

                    self.loadDataPoints(CommonService.getUniqueCurrencies(transactions), currency2, transactions, limit, dataFrequency)
                        .then((dataPoints2) => {

                            var chart = self.getChartJsInfo(currency1, dataPoints1, currency2, dataPoints2, timeRange, dataFrequency);

                            resolve(chart);

                            //console.log('Load chart data end')
                        })
                });
        });
    }

    loadDataPoints(inCurrencies, toCurrency, transactions, limit, dataFrequency) {

        var self = this;

        return new Promise(function (resolve, reject) {

            if (!toCurrency) {
                resolve(null);
                return;
            }

            var dataPoints = self.getInitialseDataPoints(limit, dataFrequency);
            self.loadDataPointsForCurrency(inCurrencies, toCurrency, dataPoints, transactions, limit, dataFrequency, resolve);
        });
    }

    loadDataPointsForCurrency(inCurrencies, toCurrency, dataPoints, transactions, limit, dataFrequency, resolve) {

        var self = this;

        if (inCurrencies.length == 0) {
            resolve(dataPoints);
            return;
        }

        var fromCurrency = inCurrencies.pop();

        //console.log('loading: ' + fromCurrency + "," + toCurrency);

        if (fromCurrency == toCurrency) {
            var dailyData = self.getSelfReferenceDailyData(dataPoints);
            self.loadDataPointsForDailyData(dataPoints, transactions, fromCurrency, dailyData);
            self.loadDataPointsForCurrency(inCurrencies, toCurrency, dataPoints, transactions, limit, dataFrequency, resolve);
        }
        else {
            var api = CommonService.getHistoricalPriceApi(dataFrequency);
            api(fromCurrency, toCurrency, limit)
                .then(dailyData => {
                    self.loadDataPointsForDailyData(dataPoints, transactions, fromCurrency, dailyData);
                    self.loadDataPointsForCurrency(inCurrencies, toCurrency, dataPoints, transactions, limit, dataFrequency, resolve);
                })
        }
    }

    loadDataPointsForDailyData(dataPoints, transactions, fromCurrency, dailyData) {

        var self = this;

        var coinCount = 0;

        dailyData.forEach(d => {

            var date = moment.unix(d.time);

            var dataPoint = dataPoints[d.time];

            if (!dataPoint)
                return;

            dataPoint.setPrice(fromCurrency, d.close);
            dataPoint.setStartingAmount(fromCurrency, 0)

            //Find transactions for this day
            var matches = self.getTransactions(transactions, date, fromCurrency);
            matches.forEach((t) => {
                dataPoint.addTransaction(t);
            })

            //Find sales for this day
            matches = self.getSales(transactions, date, fromCurrency);
            matches.forEach((s) => {
                dataPoint.addSale(fromCurrency, s);
            })
        });

    }

    getSelfReferenceDailyData(dataPoints) {
        var dailyData = [];

        for (var t in dataPoints) {
            if (dataPoints.hasOwnProperty(t)) {
                //Close will always be one 
                dailyData.push({
                    time: t,
                    close: 1
                });
            }
        }
        return dailyData;
    }

    getInitialseDataPoints(limit, dataFrequency) {

        var dataPoints = {};
        var start = moment().utc().startOf('day');

        for (var i = limit; i >= 0; i--) {
            var date = start.clone().subtract(i, dataFrequency);
            dataPoints[date.unix()] = new PortfolioChartServiceDataPoint(date);
        }

        return dataPoints;
    }

    //How many days/hours to go back
    getLimit(transactions, dataFrequency) {

        //get the first transaction
        var transaction = transactions[0];

        var firstDate = moment(transaction.date);
        var now = moment().startOf('day');

        var duration = moment.duration(now.diff(firstDate));

        if (dataFrequency == 'days')
            return Math.ceil(duration.asDays());

        return Math.ceil(duration.asHours());
    }

    getTransactions(transactions, date, currency) {

        return transactions.filter(t => {
            //return (t.date.indexOf(date) == 0 && t.currency == currency);
            return (moment(t.date).isBefore(date) && t.currency == currency);
        });
    }

    getSales(transactions, date, currency) {

        var sales = [];

        transactions.forEach(transaction => {

            if (transaction.currency != currency)
                return;

            transaction.sales.forEach(sale => {
                //if (sale.date.indexOf(date) == 0)
                if (moment(sale.date).isBefore(date))
                    sales.push(sale);
            })
        })

        return sales;
    }

    getChartJsInfo(currency1, dataPoints1, currency2, dataPoints2, timeRange, dataFrequency) {

        var arr1 = this.formatDataPointsForChartJs(dataPoints1, timeRange);
        var arr2 = this.formatDataPointsForChartJs(dataPoints2, timeRange);

        var dataSets = [];

        if (arr1) {
            var values = arr1.map(dp => {
                return dp.getTotal();
            });
            dataSets.push(CommonService.getChartJsDataset(values, currency1, CommonService.getCurrencyColour(currency1), "y-axis-1"));
        }

        if (arr2) {
            var values = arr2.map(dp => {
                return dp.getTotal();
            });
            dataSets.push(CommonService.getChartJsDataset(values, currency2, CommonService.getCurrencyColour(currency2), "y-axis-2"));
        }

        return {
            chartjs: {
                data: {
                    labels: this.getChartJsLabels(arr1, arr2),
                    datasets: dataSets
                },
                options: CommonService.getChartJsOptions(arr1, arr2, currency1, currency2, dataFrequency),
                plugins: CommonService.getPlugins()
            },
            rawData: {
                fiat: arr1,
                coin: arr2
            }
        };
    }

    formatDataPointsForChartJs(dataPoints, timeRange) {

        if (!dataPoints)
            return null;

        var arr = CommonService.objectToArray(dataPoints);
        arr = this.filterOnTimeRange(arr, timeRange);
        arr = this.filterOutEmptyDataPoints(arr);
        return arr;
    }

    getChartJsLabels(dataPoints1, dataPoints2) {
        var arr = dataPoints1 ? dataPoints1 : dataPoints2;

        if (!arr)
            return [];

        return arr.map(dp => {
            return dp.date;
        });
    }

    filterOnTimeRange(dataPoints, timeRange) {
        var from = moment().startOf('day').subtract(timeRange, 'days');
        return dataPoints.filter(dataPoint => {
            return dataPoint.date.isAfter(from);
        });
    }

    filterOutEmptyDataPoints(dataPoints) {

        while (dataPoints.length > 0) {
            if (dataPoints[0].getTotal() == 0)
                dataPoints.shift();
            else
                return dataPoints;
        }
    }
}

export default PortfolioChartService;