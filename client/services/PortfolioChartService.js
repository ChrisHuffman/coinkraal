import agentExt from '../agent-ext';
import moment from 'moment';
import PortfolioChartServiceDataPoint from './PortfolioChartServiceDataPoint';

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

            var dataFrequencyLimit = 90;
            var dataFrequency = timeRange <= dataFrequencyLimit ? 'hours' : 'days';
            var limit = self.getLimit(transactions, dataFrequency);

            //We might have asked for 'Last Year' but if we only have transactions going 
            //back a few days then override the dataFrequency and set to hours 
            if (limit < dataFrequencyLimit && dataFrequency == 'days') {
                dataFrequency = 'hours';
                limit = self.getLimit(transactions, dataFrequency);
            }

            var inCurrencies = self.getUniqueInCurrencies(transactions);

            //console.log('Starting to load chart data..');

            self.loadDataPoints(self.getUniqueInCurrencies(transactions), currency1, transactions, limit, dataFrequency)
                .then((dataPoints1) => {

                    self.loadDataPoints(self.getUniqueInCurrencies(transactions), currency2, transactions, limit, dataFrequency)
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
            var api = this.getHistoricalPriceApi(dataFrequency);
            api(fromCurrency, toCurrency, limit)
                .then(dailyData => {
                    self.loadDataPointsForDailyData(dataPoints, transactions, fromCurrency, dailyData);
                    self.loadDataPointsForCurrency(inCurrencies, toCurrency, dataPoints, transactions, limit, dataFrequency, resolve);
                })
        }
    }

    getHistoricalPriceApi(dataFrequency) {
        if (dataFrequency == 'days')
            return agentExt.External.getDailyHistoricalPrice;
        return agentExt.External.getHourlyHistoricalPrice;
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

        if (arr1)
            dataSets.push(this.getChartJsDataset(arr1, currency1, this.getCurrencyColour(currency1), "y-axis-1"));

        if (arr2)
            dataSets.push(this.getChartJsDataset(arr2, currency2, this.getCurrencyColour(currency2), "y-axis-2"));

        return {
            data: {
                labels: this.getChartJsLabels(arr1, arr2),
                datasets: dataSets
            },
            options: this.getChartJsOptions(arr1, arr2, currency1, currency2, dataFrequency),
            plugins: this.getPlugins()
        };
    }

    formatDataPointsForChartJs(dataPoints, timeRange) {

        if (!dataPoints)
            return null;

        var arr = this.objectToArray(dataPoints);
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
        };
    }

    getChartJsOptions(arr1, arr2, currency1, currency2, dataFrequency) {

        var self = this;

        var options = {
            customLine: {
                color: 'white'
            },
            responsive: true,
            hoverMode: 'index',
            stacked: false,
            legend: {
                labels: {
                    usePointStyle: true
                }
            },
            tooltips: {
                position: 'nearest',
                mode: 'index',
                intersect: false,
                cornerRadius: 2
            },
            scales: {
                xAxes: [{
                    type: 'time',
                    time: {
                        unit: dataFrequency == 'days' ? 'month' : 'day'
                    }
                }],
                yAxes: [],
            }
        };

        if (arr1) {
            options.scales.yAxes.push({
                type: 'linear',
                display: true,
                position: 'left',
                id: 'y-axis-1',
                ticks: {
                    callback: function (value, index, values) {
                        return self.formatCurrency(value);
                    }
                },
                scaleLabel: {
                    display: true,
                    labelString: currency1
                }
            });
        };

        if (arr2) {
            options.scales.yAxes.push({
                type: 'linear',
                display: true,
                position: 'right',
                id: 'y-axis-2',
                ticks: {
                    callback: function (value, index, values) {
                        return self.formatCurrency(value);
                    }
                },
                scaleLabel: {
                    display: true,
                    labelString: currency2
                }
            });
        };

        return options;
    }

    getPlugins() {

        var verticalLinePlugin = {
            afterDatasetsDraw: function (chart) {

                if (chart.tooltip._active && chart.tooltip._active.length) {

                    var activePoint = chart.tooltip._active[0];
                    var ctx = chart.ctx;
                    var y_axis = chart.scales['y-axis-1'] || chart.scales['y-axis-2'];

                    if(!y_axis)
                        return;

                    var x = activePoint.tooltipPosition().x;
                    var topY = y_axis.top;
                    var bottomY = y_axis.bottom;

                    // draw line
                    ctx.save();
                    ctx.beginPath();
                    ctx.moveTo(x, topY);
                    ctx.lineTo(x, bottomY);
                    ctx.lineWidth = 1;
                    ctx.strokeStyle = '#585858';
                    ctx.stroke();
                    ctx.restore();
                }
            }
        };

        return [ verticalLinePlugin ]
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

    formatCurrency(amount) {

        var minimumFractionDigits = 2;
        var maximumFractionDigits = 2;

        if (amount < 0.01)
            maximumFractionDigits = 6

        if (amount > 1000000) {
            maximumFractionDigits = 0;
            minimumFractionDigits = 0;
        }

        return parseFloat(amount).toLocaleString(undefined, {
            minimumFractionDigits: minimumFractionDigits,
            maximumFractionDigits: maximumFractionDigits
        });
    }
}

export default PortfolioChartService;