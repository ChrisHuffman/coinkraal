import { observable, observe, action } from 'mobx';

export class PortfolioPageState {

    transactionStore = null;
    portfolioChartService = null;

    @observable portfolioChartData = { };
    portfolioChartSelectedFiat = "USD";
    portfolioChartSelectedCoin = "BTC";
    portfolioChartSelectedTimeRange = 30;

    @observable isLoadingPorfolioChartData = true;
    
    constructor(transactionStore, portfolioChartService) {

        this.transactionStore = transactionStore;
        this.portfolioChartService = portfolioChartService;
        
        observe(transactionStore.transactions, () => {
            this.portfolioChartLoadData();
        });
    }

    @action portfolioChartLoadData() {

        this.isLoadingPorfolioChartData = true;

        this.portfolioChartService.getData(this.transactionStore.transactions, this.portfolioChartSelectedFiat, this.portfolioChartSelectedCoin, this.portfolioChartSelectedTimeRange)
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