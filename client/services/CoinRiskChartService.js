import moment from 'moment';
import CommonService from './CommonService';
import CoinChartServiceDataPoint from '../models/CoinChartServiceDataPoint';

export class CoinChartService {

    getData(transactionSummaries) {
        var self = this;
        return new Promise(function (resolve, reject) {
            resolve(self.getChartJsData(transactionSummaries));
        });
    }

    getChartJsData(transactionSummaries) {

        var dataPoints = transactionSummaries.map(t => {
            return {
                label: t.currency,
                value: t.btcValue
            }
        });

        if (dataPoints.length > 6) {
            var others = dataPoints.splice(5, dataPoints.length - 5);
            var othersValue = others.reduce((sum, current) => {
                return sum + current.value;
            }, 0);

            dataPoints.push({
                label: "Others",
                value: othersValue
            });
        }

        //Convert to percentages
        var totalValue = dataPoints.reduce((sum, current) => { return sum + current.value; }, 0);
        dataPoints.forEach(dp => {
            dp.value = Math.round(dp.value / totalValue * 100);
        });

        var dataset = {
            data: dataPoints.map(d => d.value),
            backgroundColor: [
                '#75B9BE',
                '#8DB580',
                '#BFD7EA',
                '#6D8EA0',
                '#7B6D8D',
                '#FFCAB1'
            ]
        }

        return {
            data: {
                labels: dataPoints.map(d => d.label),
                datasets: [dataset]
            },
            options: {
                tooltips: {
                    enabled: true,
                    callbacks: {
                        label: function (tooltipItem, data) {
                            var dataset = data.datasets[tooltipItem.datasetIndex];
                            var currentValue = dataset.data[tooltipItem.index];
                            return `${data.labels[tooltipItem.index]}: ${currentValue}%`;
                        }
                    }
                }
            }
        }
    };
}


export default CoinChartService;