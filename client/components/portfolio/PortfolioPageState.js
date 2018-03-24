import { observable, observe, action, reaction, computed } from 'mobx';

export class PortfolioPageState {

    transactionStore = null;
    portfolioChartService = null;
    transactionSummaryService = null;

    @observable portfolioChartData = { };
    @observable portfolioRawData = { };
    portfolioChartSelectedTimeRange = 30;
    @observable isLoadingPorfolioChartData = true;

    @observable transactionSummaries = [];
    
    constructor(global, transactionStore, portfolioChartService, transactionSummaryService) {

        this.global = global;
        this.transactionStore = transactionStore;
        this.portfolioChartService = portfolioChartService;
        this.transactionSummaryService = transactionSummaryService;
        
        observe(this.transactionStore.transactions, () => {
            this.loadTransactionSummaries();
            this.loadPortfolioChartData();
        });

        reaction(() => this.global.selectedFiat, () => {
            this.loadPortfolioChartData();
        });

        reaction(() => this.global.selectedCoin, () => {
            this.loadPortfolioChartData();
        });
    }

    @action loadPortfolioChartData() {

        this.isLoadingPorfolioChartData = true;

        this.portfolioChartService.getData(this.transactionStore.transactions, this.global.selectedFiat, this.global.selectedCoin, this.portfolioChartSelectedTimeRange)
            .then(action(data => {
                this.portfolioChartData = data.chartjs;
                this.portfolioRawData = data.rawData;
                this.isLoadingPorfolioChartData = false;
            }));
    }

    portfolioChartSetFilters(filters) {
        this.portfolioChartSelectedTimeRange = filters.selectedTimeRange;
        this.portfolioChartLoadData();
    }

    @computed get latestFiatValue() {
        if(!this.portfolioRawData.fiat || this.portfolioRawData.fiat.length == 0)
            return 0;

        return this.portfolioRawData.fiat[this.portfolioRawData.fiat.length - 1].getTotal();
    }

    @computed get latestCoinValue() {
        if(!this.portfolioRawData.coin || this.portfolioRawData.coin.length == 0)
            return 0;

        return this.portfolioRawData.coin[this.portfolioRawData.coin.length - 1].getTotal();
    }

    @action loadTransactionSummaries() {

        this.transactionSummaryService.getTransactionSummaries(this.transactionStore.transactions)
            .then(action(summaries => {
                this.transactionSummaries = summaries;
            }));
    }
}

export default PortfolioPageState;