import { observable, observe, action, reaction } from 'mobx';

export class PortfolioPageState {

    transactionStore = null;
    portfolioChartService = null;

    @observable portfolioChartData = { };
    portfolioChartSelectedFiat = "USD";
    portfolioChartSelectedCoin = "BTC";
    portfolioChartSelectedTimeRange = 30;

    @observable isLoadingPorfolioChartData = true;
    
    constructor(global, transactionStore, portfolioChartService) {

        this.global = global;
        this.transactionStore = transactionStore;
        this.portfolioChartService = portfolioChartService;
        
        observe(this.transactionStore.transactions, () => {
            this.portfolioChartLoadData();
        });

        reaction(() => this.global.selectedFiat, () => {
            this.portfolioChartLoadData();
        });

        reaction(() => this.global.selectedCoin, () => {
            this.portfolioChartLoadData();
        });
    }

    @action portfolioChartLoadData() {

        this.isLoadingPorfolioChartData = true;

        this.portfolioChartService.getData(this.transactionStore.transactions, this.global.selectedFiat, this.global.selectedCoin, this.portfolioChartSelectedTimeRange)
            .then(action(data => {
                this.portfolioChartData = data;
                this.isLoadingPorfolioChartData = false;
            }));
    }

    portfolioChartSetFilters(filters) {
        this.portfolioChartSelectedFiat = filters.selectedFiat;
        this.portfolioChartSelectedCoin = filters.selectedCoin;
        this.portfolioChartSelectedTimeRange = filters.selectedTimeRange;
        this.portfolioChartLoadData();
    }
}

export default PortfolioPageState;