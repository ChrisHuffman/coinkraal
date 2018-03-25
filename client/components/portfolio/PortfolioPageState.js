import { observable, action, reaction, computed } from 'mobx';

export class PortfolioPageState {

    global = null;
    transactionStore = null;
    priceStore = null;
    portfolioChartService = null;
    transactionSummaryService = null;

    @observable portfolioChartData = { };
    @observable portfolioRawData = { };
    portfolioChartSelectedTimeRange = 30;
    @observable isLoadingPorfolioChartData = true;

    @observable transactionSummaries = [];
    
    constructor(global, transactionStore, priceStore, portfolioChartService, transactionSummaryService) {

        this.global = global;
        this.transactionStore = transactionStore;
        this.priceStore = priceStore;
        this.portfolioChartService = portfolioChartService;
        this.transactionSummaryService = transactionSummaryService;
        
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

    portfolioChartSetFilters(filters) {
        this.portfolioChartSelectedTimeRange = filters.selectedTimeRange;
        this.loadPortfolioChartData();
    }

    @action loadTransactionSummaries() {

        this.transactionSummaryService.getTransactionSummaries(this.transactionStore.transactions, 
                        this.global.fiatOptions, 
                        this.global.coinOptions,
                        this.priceStore.priceIndex)
            .then(action(summaries => {
                this.transactionSummaries = summaries;
            }));
    }
}

export default PortfolioPageState;