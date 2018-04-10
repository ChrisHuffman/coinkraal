import { observable, action, reaction, computed } from 'mobx';

export class PortfolioPageState {

    global = null;
    transactionStore = null;
    priceStore = null;
    portfolioChartService = null;
    transactionSummaryService = null;
    coinRiskChartService = null;

    @observable portfolioChartData = { };
    @observable portfolioRawData = { };
    portfolioChartSelectedTimeRange = 90;
    @observable isLoadingPorfolioChartData = true;

    @observable transactionSummaries = [];
    @observable pageIndex = 0;
    pageSize = 7;

    @observable coinRiskChartData = { };
    
    constructor(global, transactionStore, priceStore, portfolioChartService, transactionSummaryService, coinRiskChartService) {

        this.global = global;
        this.transactionStore = transactionStore;
        this.priceStore = priceStore;
        this.portfolioChartService = portfolioChartService;
        this.transactionSummaryService = transactionSummaryService;
        this.coinRiskChartService = coinRiskChartService;
        
        reaction(() => this.transactionStore.transactions, () => {
            this.loadTransactionSummaries();
            this.loadPortfolioChartData();
        });

        reaction(() => this.priceStore.priceIndex, () => {
            this.loadTransactionSummaries();
        });

        reaction(() => this.global.selectedFiat, () => {
            this.loadPortfolioChartData();
        });

        reaction(() => this.global.selectedCoin, () => {
            this.loadPortfolioChartData();
        });

        reaction(() => this.transactionSummaries, () => {
            this.loadCoinRishChartData();
        });
    }

    @action loadPortfolioChartData() {

        this.isLoadingPorfolioChartData = true;

        this.portfolioChartService.getData(this.transactionStore.transactions.slice(), this.global.selectedFiat, this.global.selectedCoin, this.portfolioChartSelectedTimeRange)
            .then(action(data => {
                this.portfolioChartData = data.chartjs;
                this.portfolioRawData = data.rawData;
                this.isLoadingPorfolioChartData = false;
            }));
    }

    @action loadCoinRishChartData() {

        this.coinRiskChartService.getData(this.transactionSummaries)
            .then(action(data => {
                this.coinRiskChartData = data;
            }));
    }

    portfolioChartSetFilters(filters) {
        this.portfolioChartSelectedTimeRange = filters.selectedTimeRange;
        this.loadPortfolioChartData();
    }

    @action loadTransactionSummaries() {

        this.pageIndex = 0;
        this.transactionSummaryService.getTransactionSummaries(this.transactionStore.transactions, 
                        this.global.fiatOptions, 
                        this.global.coinOptions,
                        this.priceStore.priceIndex)
            .then(action(summaries => {
                this.transactionSummaries = summaries;
            }));
    }

    @computed get transactions() {
        var start = this.pageIndex * this.pageSize;
        var page = this.transactionSummaries.slice(start, start + this.pageSize);
        return page;
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
        return this.transactionSummaries.length - (this.pageIndex * this.pageSize) <= this.pageSize;
    }
}

export default PortfolioPageState;