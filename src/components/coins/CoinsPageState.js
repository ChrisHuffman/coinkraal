import { observable, action, computed } from 'mobx';

export class CoinsPageState {

    @observable selectedCoinSymbol = null;
    @observable coinSummaryModal = false;

    coinChartService = null;
    @observable coinChartData = {};
    coinChartSelectedTimeRange = 365;
    @observable isLoadingCoinChartData = true;

    @observable isLoading = false;
    @observable pageIndex = 0;
    pageSize = 100;
    @observable sortColumn = "rank";
    @observable sortDirection = "asc";

    @observable showMyCoinsFirst = false;
    myCurrencies = [];

    constructor(global, coinStore, transactionStore, coinChartService, chartJsService, utilityService) {
        this.global = global;
        this.coinStore = coinStore;
        this.transactionStore = transactionStore;
        this.coinChartService = coinChartService;
        this.chartJsService = chartJsService;
        this.utilityService = utilityService;
    }

    @computed get coins() {

        this.myCurrencies = this.transactionStore.getUniqueCurrencies();
        var start = this.pageIndex * this.pageSize;
        var coins = this.coinStore.coins.slice(0);
        var myCoins = [];

        if (this.showMyCoinsFirst && this.pageIndex == 0) {
            //Get my coins
            myCoins = coins.filter(c => {
                return this.myCurrencies.indexOf(c.symbol) != -1;
            })

            //The rest
            var coins = coins.filter(c => {
                return this.myCurrencies.indexOf(c.symbol) == -1;
            })

            myCoins.sort(this.compareValues(this.sortColumn, this.sortDirection));
        }

        //Page
        var page = coins.slice(start, start + this.pageSize - myCoins.length);

        //Sort
        page.sort(this.compareValues(this.sortColumn, this.sortDirection));

        //Add my coins to the front
        if(myCoins.length > 0) {
            page = myCoins.concat(page);
        }

        return page;
    }

    @action sort(column) {

        //Same column so switch direction
        if (this.sortColumn == column)
            this.sortDirection = this.sortDirection == "asc" ? "desc" : "asc";

        this.sortColumn = column;
    }

    @action nextPage() {
        this.pageIndex += 1;
    }

    @action previousPage() {
        this.pageIndex -= 1;
    }

    @computed get isFirstPage() {
        return this.pageIndex == 0;
    }

    @computed get isLastPage() {
        return this.coinStore.coins.length - (this.pageIndex * this.pageSize) <= this.pageSize;
    }

    @action toggleShowMyCoinsFirst() {
        this.pageIndex = 0;
        this.showMyCoinsFirst = !this.showMyCoinsFirst;
    }

    @action toggleCoinSummaryModal(coinSymbol) {
        this.selectedCoinSymbol = coinSymbol;
        this.coinSummaryModal = !this.coinSummaryModal;
    }

    @action loadCoinChartData() {

        this.isLoadingCoinChartData = true;

        let currency1 = this.global.selectedFiat;
        let currency2 = this.global.selectedCoin;

        this.coinChartService.getData(this.selectedCoinSymbol, currency1, currency2, this.coinChartSelectedTimeRange)
            .then(action(data => {

                let dataPoints = data.dataPoints;

                let datasets = [];
                let dataPoints1 = dataPoints[0];
                let dataPoints2 = dataPoints[1];

                if(dataPoints1.length > 0) {
                    let values = dataPoints1.map(dp => dp.value);
                    datasets.push(this.chartJsService.getLineChartJsDataset(values, currency1, this.utilityService.getCurrencyColour(currency1), "y-axis-1"));
                }
        
                if(dataPoints2.length > 0) {
                    let values = dataPoints2.map(dp => dp.value);
                    datasets.push(this.chartJsService.getLineChartJsDataset(values, currency2, this.utilityService.getCurrencyColour(currency2), "y-axis-2") );
                }
        
                this.coinChartData = {
                    data: {
                        labels: this.getChartJsLabels(dataPoints1, dataPoints2),
                        datasets: datasets
                    },
                    options: this.chartJsService.getLineChartJsOptions(dataPoints1, dataPoints2, currency1, currency2, data.dataFrequency),
                    plugins: [ this.chartJsService.getVerticalLinePlugin() ]
                };


                this.isLoadingCoinChartData = false;
            }));
    }

    getChartJsLabels(dataPoints1, dataPoints2) {
        let arr = dataPoints1 ? dataPoints1 : dataPoints2;

        if (!arr)
            return [];

        return arr.map(dp => dp.date);
    }

    coinChartSetFilters(filters) {
        this.coinChartSelectedTimeRange = filters.selectedTimeRange;
        this.loadCoinChartData();
    }

    compareValues(key, direction) {
        
        return (a, b) => {

            if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key))
                return 0;

            let varA = (typeof a[key] === 'string') ? a[key].toUpperCase() : a[key];
            let varB = (typeof b[key] === 'string') ? b[key].toUpperCase() : b[key];

            let comparison = 0;

            if (varA > varB)
                comparison = 1;
            else if (varA < varB)
                comparison = -1;

            return (direction == 'desc') ? (comparison * -1) : comparison;
        };
    }
}

export default CoinsPageState;