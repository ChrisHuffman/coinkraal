import moment from 'moment';
import agentExt from '../agent-ext';

export class CommonService {

    getHistoricalPriceApi(dataFrequency) {
        if (dataFrequency == 'days')
            return agentExt.External.getDailyHistoricalPrice;
        return agentExt.External.getHourlyHistoricalPrice;
    }

    getChartJsDataset(data, label, borderColor, yAxisId) {

        return {
            label: label,
            data: data,
            borderWidth: 1,
            pointRadius: 0,
            backgroundColor: 'rgb(255, 99, 132)',
            fill: 'start',
            borderColor: borderColor,
            yAxisID: yAxisId,
            lineTension: 0,
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
                        unit: (arr1 && arr1.length < 90)  || (arr2 && arr2.length < 90) ? 'day' : 'month'
                    }
                }],
                yAxes: [],
            }
        };

        if (arr1 && arr1.length > 0) {
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

        if (arr2 && arr2.length > 0) {
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

    isNaN(number) {
        
        if (number === "")
            return true;

        return isNaN(number);
    }

    formatCurrency(amount) {

        if(this.isNaN(amount))
            return '?';

        var minimumFractionDigits = 2;
        var maximumFractionDigits = 2;

        if(amount < 0.09)
            maximumFractionDigits = 4

        if(amount < 0.009)
            maximumFractionDigits = 6

        if(amount < 0.0009)
            maximumFractionDigits = 8

        if(amount >= 1000 || amount % 1 == 0) {
            maximumFractionDigits = 0;
            minimumFractionDigits = 0;
        }

        return parseFloat(amount).toLocaleString(undefined, {
            minimumFractionDigits: minimumFractionDigits,
            maximumFractionDigits: maximumFractionDigits
          });
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

export default new CommonService();