import agentExt from '../agent-ext';
import moment from 'moment';
import CoinChartServiceDataPoint from './CoinChartServiceDataPoint';

export class CoinChartService {

    getData(coin, currency1, currency2, timeRange) {

        var self = this;

        return new Promise(function (resolve, reject) {

            var dataFrequencyLimit = 90;
            var dataFrequency = timeRange <= dataFrequencyLimit ? 'hours' : 'days';

            var limit = timeRange;

            if(dataFrequency == 'hours')
                limit = limit * 24;

            self.loadDataPoints(coin, currency1, limit, dataFrequency)
                .then((dataPoints1) => {

                    self.loadDataPoints(coin, currency2, limit, dataFrequency)
                        .then((dataPoints2) => {

                            var data = self.getChartJsData(currency1, dataPoints1, currency2, dataPoints2, timeRange, dataFrequency);
                            resolve(data);
                        })
                });
        });
    }

    loadDataPoints(fromCurrency, toCurrency, limit, dataFrequency) {

        var self = this;
        var dataPoints = [];

        return new Promise(function (resolve, reject) {
            self.loadDataPointsForCurrency(fromCurrency, toCurrency, dataPoints, limit, dataFrequency, resolve);
        });
    }

    loadDataPointsForCurrency(fromCurrency, toCurrency, dataPoints, limit, dataFrequency, resolve) {

        var self = this;

        if (fromCurrency == toCurrency) {
            resolve(dataPoints);
            return;
        }
        else {

            var api = this.getHistoricalPriceApi(dataFrequency);

            api(fromCurrency, toCurrency, limit)
                .then(dailyData => {
                    self.loadDataPointsForDailyData(dataPoints, fromCurrency, dailyData, resolve);
                })
        }
    }

    getHistoricalPriceApi(dataFrequency) {
        if (dataFrequency == 'days')
            return agentExt.External.getDailyHistoricalPrice;
        return agentExt.External.getHourlyHistoricalPrice;
    }

    loadDataPointsForDailyData(dataPoints, fromCurrency, dailyData, resolve) {

        var self = this;

        dailyData.forEach(d => {

            var date = moment.unix(d.time);
            
            var dataPoint = new CoinChartServiceDataPoint(date)
            dataPoint.value = d.close;

            dataPoints.push(dataPoint);
        });

        resolve(dataPoints);
    }

    getChartJsData(currency1, dataPoints1, currency2, dataPoints2, timeRange, dataFrequency) {

        return {
            data: {
                labels: this.getChartJsLabels(dataPoints1, dataPoints2),
                datasets: [
                    this.getChartJsDataset(dataPoints1, currency1, "rgba(40, 167, 69, 0.8)", "y-axis-1"), //, "#28a745"
                    this.getChartJsDataset(dataPoints2, currency2, "rgba(253, 126, 20, 0.8)", "y-axis-2") //, "#fd7e14"
                ]
            },
            options: this.getChartJsOptions(dataPoints1, dataPoints2, currency1, currency2, dataFrequency),
            plugins: this.getPlugins()
        };
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

                    if (!y_axis)
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

        return [verticalLinePlugin]
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

export default CoinChartService;