import { observable, action, computed } from 'mobx';

export class CoinsPageState {

    coinStore = null;
    transactionStore = null;

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

    constructor(global, coinStore, transactionStore, coinChartService) {
        this.global = global;
        this.coinStore = coinStore;
        this.transactionStore = transactionStore;
        this.coinChartService = coinChartService;
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

            console.log('my coins', myCoins);

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

        this.coinChartService.getData(this.selectedCoinSymbol, this.global.selectedFiat, this.global.selectedCoin, this.coinChartSelectedTimeRange)
            .then(action(data => {
                this.coinChartData = data;
                this.isLoadingCoinChartData = false;
            }));
    }

    coinChartSetFilters(filters) {
        this.coinChartSelectedTimeRange = filters.selectedTimeRange;
        this.loadCoinChartData();
    }

    compareValues(key, direction) {
        var self = this;
        return function (a, b) {

            if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key))
                return 0;

            // if (self.showMyCoinsFirst) {
            //     if (uniqueCurrencies.indexOf(a.symbol) != -1 && uniqueCurrencies.indexOf(b.symbol) == -1)
            //         return -1;

            //     if (uniqueCurrencies.indexOf(b.symbol) != -1 && uniqueCurrencies.indexOf(a.symbol) == -1)
            //         return 1;
            // }

            var varA = (typeof a[key] === 'string') ? a[key].toUpperCase() : a[key];
            var varB = (typeof b[key] === 'string') ? b[key].toUpperCase() : b[key];

            var comparison = 0;

            if (varA > varB)
                comparison = 1;
            else if (varA < varB)
                comparison = -1;

            return (direction == 'desc') ? (comparison * -1) : comparison;
        };
    }
}

export default CoinsPageState;