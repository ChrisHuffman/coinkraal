import agentExt from '../agent-ext';
import moment from 'moment';
import PortfolioChartServiceDataPoint from './PortfolioChartServiceDataPoint';

export class PortfolioChartService {

    getData(transactions, currency1, currency2) {

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

            //console.log('Starting to load chart data..');

            self.loadDataPoints(self.getUniqueInCurrencies(transactions), currency1, transactions, limit)
                .then((dataPoints1) => {

                    self.loadDataPoints(self.getUniqueInCurrencies(transactions), currency2, transactions, limit)
                        .then((dataPoints2) => {

                            var data = self.getChartJsData(currency1, dataPoints1, currency2, dataPoints2);

                            resolve(data);

                            //console.log('Load chart data end')
                        })
                });
        });
    }

    loadDataPoints(inCurrencies, toCurrency, transactions, limit) {

        var self = this;
        var dataPoints = self.getInitialseDataPoints(limit);

        return new Promise(function (resolve, reject) {

            self.loadDataPointsForCurrency(inCurrencies, toCurrency, dataPoints, transactions, limit, resolve);
        });
    }

    loadDataPointsForCurrency(inCurrencies, toCurrency, dataPoints, transactions, limit, resolve) {

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
            self.loadDataPointsForCurrency(inCurrencies, toCurrency, dataPoints, transactions, limit, resolve);
        }
        else {

            agentExt.External.getDailyHistoricalPrice(fromCurrency, toCurrency, limit)
                .then(dailyData => {
                    self.loadDataPointsForDailyData(dataPoints, transactions, fromCurrency, dailyData);
                    self.loadDataPointsForCurrency(inCurrencies, toCurrency, dataPoints, transactions, limit, resolve);
                })
        }
    }

    loadDataPointsForDailyData(dataPoints, transactions, fromCurrency, dailyData) {

        var self = this;

        var coinCount = 0;
        var previousAmount = 0;

        dailyData.forEach(d => {

            var date = moment.unix(d.time).utc().format('YYYY-MM-DD');

            var dataPoint = dataPoints[d.time];

            dataPoint.setPrice(fromCurrency, d.close);
            dataPoint.setStartingAmount(fromCurrency, previousAmount)

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

            previousAmount = dataPoint.amounts[fromCurrency];
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

    getInitialseDataPoints(limit) {

        var dataPoints = {};
        var start = moment().utc().startOf('day');

        for (var i = limit; i >= 0; i--) {
            var date = start.clone().subtract(i, 'days');
            dataPoints[date.unix()] = new PortfolioChartServiceDataPoint(date);
        }

        return dataPoints;
    }

    //How many days to go back
    getLimit(transactions) {

        //return 1000; 

        //get the first transaction
        var transaction = transactions[0];

        var firstDate = moment(transaction.date);
        var now = moment().startOf('day');

        var duration = moment.duration(now.diff(firstDate));
        return Math.ceil(duration.asDays());
    }

    getUniqueInCurrencies(transactions) {
        var currencies = transactions.map(t => {
            return t.currency;
        })
        return currencies.filter(this.unique);
    }

    unique(value, index, self) {
        return self.indexOf(value) === index;
    }

    getTransactions(transactions, date, currency) {

        return transactions.filter(t => {
            return (t.date.indexOf(date) == 0 && t.currency == currency);
        });
    }

    getSales(transactions, date, currency) {

        var sales = [];

        transactions.forEach(transaction => {

            if (transaction.currency != currency)
                return;

            transaction.sales.forEach(sale => {
                if (sale.date.indexOf(date) == 0)
                    sales.push(sale);
            })
        })

        return sales;
    }

    getChartJsData(currency1, dataPoints1, currency2, dataPoints2) {

        var arr1 = this.objectToArray(dataPoints1);
        var arr2 = this.objectToArray(dataPoints2);

        var labels = arr1.map(dp => {
            return dp.date;
        });

        return {
            labels: labels,
            datasets: [
                this.getChartJsDataset(arr1, currency1, this.getCurrencyColour(currency1), "y-axis-1"),
                this.getChartJsDataset(arr2, currency2, this.getCurrencyColour(currency2), "y-axis-2")
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
            yAxisID: yAxisId,
            lineTension: 0.1,
            pointStyle: 'rectRot'
            //cubicInterpolationMode: 'monotone'
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

    getCurrencyColour(currency) {

        switch (currency) {
            case "BTC":
                return "rgba(253, 126, 20, 0.8)";
            case "ETH":
                return "rgba(74, 144, 226, 0.8)";
            case "NEO":
                return "rgba(139, 195, 74, 0.8)";
            default:
                return "rgba(40, 167, 69, 0.8)";
        }

    }
}

export default PortfolioChartService;