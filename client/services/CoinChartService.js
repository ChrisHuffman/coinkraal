import agentExt from '../agent-ext';
import moment from 'moment';
import CoinChartServiceDataPoint from './CoinChartServiceDataPoint';

export class CoinChartService {

    getData(coin) {

        var self = this;

        return new Promise(function (resolve, reject) {

            var limit = 180;

            //console.log('Starting to load chart data..');

            self.loadDataPoints(coin, "USD", limit)
                .then((dataPointsUSD) => {

                    self.loadDataPoints(coin, "BTC", limit)
                        .then((dataPointsBTC) => {

                            var data = self.getChartJsData(dataPointsUSD, dataPointsBTC);

                            resolve(data);

                            //console.log('Load chart data end')
                        })
                });
        });
    }



    loadDataPoints(fromCurrency, toCurrency, limit) {

        var self = this;
        var dataPoints = self.getInitialseDataPoints(limit);

        return new Promise(function (resolve, reject) {

            self.loadDataPointsForCurrency(fromCurrency, toCurrency, dataPoints, limit, resolve);
        });
    }

    loadDataPointsForCurrency(fromCurrency, toCurrency, dataPoints, limit, resolve) {

        var self = this;

        if (fromCurrency == toCurrency) {
            resolve(dataPoints);
            return;
        }
        else {

            agentExt.External.getDailyHistoricalPrice(fromCurrency, toCurrency, limit)
                .then(dailyData => {
                    self.loadDataPointsForDailyData(dataPoints, fromCurrency, dailyData, resolve);
                })
        }
    }

    loadDataPointsForDailyData(dataPoints, fromCurrency, dailyData, resolve) {

        var self = this;

        dailyData.forEach(d => {

            var date = moment.unix(d.time).utc().format('YYYY-MM-DD');
            var dataPoint = dataPoints[d.time];

            dataPoint.value = d.close;
        });

        resolve(dataPoints);
    }

    getInitialseDataPoints(limit) {

        var dataPoints = {};
        var start = moment().utc().startOf('day');

        for (var i = limit; i >= 0; i--) {
            var date = start.clone().subtract(i, 'days');
            dataPoints[date.unix()] = new CoinChartServiceDataPoint(date);
        }

        return dataPoints;
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
                this.getChartJsDataset(arr1, "USD", "rgba(40, 167, 69, 0.8)", "y-axis-1"), //, "#28a745"
                this.getChartJsDataset(arr2, "BTC", "rgba(253, 126, 20, 0.8)", "y-axis-2") //, "#fd7e14"
            ]
        };
    }

    getChartJsDataset(dataPoints, label, borderColor, yAxisId) {

        var arr = this.objectToArray(dataPoints);

        var totals = arr.map(dp => {
            return dp.value;
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
}

export default CoinChartService;