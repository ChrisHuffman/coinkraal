import { observable, action, computed } from 'mobx';

export class CoinsPageState {

    coinStore = null;

    @observable selectedCoinSymbol = null;
    @observable coinSummaryModal = false;

    coinChartService = null;
    @observable coinChartData = { };
    coinChartSelectedTimeRange = 365;
    @observable isLoadingCoinChartData = true;

    @observable isLoading = false;
    @observable pageIndex = 0;
    pageSize = 100;
    @observable sortColumn = "rank";
    @observable sortDirection = "asc";

    constructor(global, coinStore, coinChartService) {
        this.global = global;
        this.coinStore = coinStore;
        this.coinChartService = coinChartService;
    }

    @computed get coins() {
        var start = this.pageIndex * this.pageSize;
        var page = this.coinStore.coins.slice(start, start + this.pageSize);

        page.sort(this.compareValues(this.sortColumn, this.sortDirection));
        
        return page;
    }

    @action sort(column) {
        
        //Same column so switch direction
        if(this.sortColumn == column)
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
        return function (a, b) {

            if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key))
                return 0;

            const varA = (typeof a[key] === 'string') ?
                a[key].toUpperCase() : a[key];
            const varB = (typeof b[key] === 'string') ?
                b[key].toUpperCase() : b[key];

            let comparison = 0;
            if (varA > varB) {
                comparison = 1;
            } else if (varA < varB) {
                comparison = -1;
            }
            return (
                (direction == 'desc') ? (comparison * -1) : comparison
            );
        };
    }
}

export default CoinsPageState;