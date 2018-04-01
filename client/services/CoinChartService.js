import moment from 'moment';
import CommonService from './CommonService';
import CoinChartServiceDataPoint from '../models/CoinChartServiceDataPoint';

export class CoinChartService {

    getData(coin, currency1, currency2, timeRange) {

        var self = this;

        return new Promise(function (resolve, reject) {

            var dataFrequencyLimit = 7;
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

            var api = CommonService.getHistoricalPriceApi(dataFrequency);

            api(fromCurrency, toCurrency, limit)
                .then(dailyData => {
                    self.loadDataPointsForDailyData(dataPoints, fromCurrency, dailyData, resolve);
                })
        }
    }

    loadDataPointsForDailyData(dataPoints, fromCurrency, dailyData, resolve) {

        var self = this;

        dailyData.forEach(d => {

            var date = moment.unix(d.time);
            
            var dataPoint = new CoinChartServiceDataPoint(date)
            dataPoint.value = d.close == 0 ? null : d.close;

            dataPoints.push(dataPoint);
        });

        resolve(dataPoints);
    }

    getChartJsData(currency1, dataPoints1, currency2, dataPoints2, timeRange, dataFrequency) {

        var maxDataPoints1 = this.getMaxDataPoints(dataPoints1);
        var maxDataPoints2 = this.getMaxDataPoints(dataPoints2);

        var minDataPoints = maxDataPoints1 > maxDataPoints2 ? maxDataPoints1 : maxDataPoints2;

        dataPoints1 = this.filterOutEmptyDataPoints(dataPoints1, minDataPoints);
        dataPoints2 = this.filterOutEmptyDataPoints(dataPoints2, minDataPoints);

        var datasets = [];

        if(dataPoints1.length > 0) {
            var values = dataPoints1.map(dp => {
                return dp.value;
            })
            datasets.push(CommonService.getChartJsDataset(values, currency1, CommonService.getCurrencyColour(currency1), "y-axis-1"));
        }

        if(dataPoints2.length > 0) {
            var values = dataPoints2.map(dp => {
                return dp.value;
            })
            datasets.push(CommonService.getChartJsDataset(values, currency2, CommonService.getCurrencyColour(currency2), "y-axis-2") );
        }

        return {
            data: {
                labels: this.getChartJsLabels(dataPoints1, dataPoints2),
                datasets: datasets
            },
            options: CommonService.getChartJsOptions(dataPoints1, dataPoints2, currency1, currency2, dataFrequency),
            plugins: CommonService.getPlugins()
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

    filterOutEmptyDataPoints(dataPoints, minDataPoints) {

        while (dataPoints.length > 0 && dataPoints.length > minDataPoints) {
            if (dataPoints[0].value == null)
                dataPoints.shift();
            else
                return dataPoints;
        }

        return dataPoints;
    }

    getMaxDataPoints(dataPoints) {

        dataPoints = dataPoints.slice(0);

        while (dataPoints.length > 0) {
            if (dataPoints[0].value == null) 
                dataPoints.shift();
            else
                return dataPoints.length;
        }

        return dataPoints.length;
    }

}

export default CoinChartService;