import { observable, action, computed } from 'mobx';

export class CoinsPageState {

    coinStore = null;

    @observable selectedCoin = null;
    @observable coinSummaryModal = false;

    coinChartService = null;
    @observable coinChartData = { };
    coinChartSelectedTimeRange = 30;
    @observable isLoadingCoinChartData = true;

    @observable isLoading = true;
    @observable allCoins = [];
    @observable pageIndex = 0;
    pageSize = 100;
    @observable sortColumn = "rank";
    @observable sortDirection = "asc";

    constructor(global, coinStore, coinChartService) {
        this.global = global;
        this.coinStore = coinStore;
        this.coinChartService = coinChartService;

        this.loadCoins();
    }

   

    @action loadCoins() {

        this.isLoading = true;

        this.coinStore.getCoins(0, 2000)
            .then(action((coins) => {

                var formatted = coins.map(coin => {
                    coin.rank = parseInt(coin.rank);
                    coin.price_usd = parseFloat(coin.price_usd);
                    coin.price_btc = parseFloat(coin.price_btc);
                    coin["24h_volume_usd"] = parseFloat(coin["24h_volume_usd"]);
                    coin.available_supply = parseFloat(coin.available_supply);
                    coin.total_supply = parseFloat(coin.total_supply);
                    coin.percent_change_1h = parseFloat(coin.percent_change_1h);
                    coin.percent_change_24h = parseFloat(coin.percent_change_24h);
                    coin.percent_change_7d = parseFloat(coin.percent_change_7d);

                    return coin;
                })

                this.allCoins = formatted;
                this.isLoading = false;
            }));

    }

    @computed get coins() {
        var start = this.pageIndex * this.pageSize;
        var page = this.allCoins.slice(start, start + this.pageSize);

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
        return this.allCoins.length - (this.pageIndex * this.pageSize) <= this.pageSize;
    }

    @action toggleCoinSummaryModal(coin) {
        this.selectedCoin = coin;
        this.coinSummaryModal = !this.coinSummaryModal;
    }

    @action loadCoinChartData() {

        this.isLoadingCoinChartData = true;

        this.coinChartService.getData(this.selectedCoin.symbol, this.global.selectedFiat, this.global.selectedCoin, this.coinChartSelectedTimeRange)
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