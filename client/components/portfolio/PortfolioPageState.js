import { observable, observe, action } from 'mobx';

export class PortfolioPageState {

    transactionStore = null;
    portfolioChartService = null;

    @observable portfolioChartData = { };
    portfolioChartSelectedFiat = "USD";
    portfolioChartSelectedCoin = "BTC";
    
    constructor(transactionStore, portfolioChartService) {

        this.transactionStore = transactionStore;
        this.portfolioChartService = portfolioChartService;
        
        observe(transactionStore.transactions, () => {
            this.portfolioChartLoadData();
        });
    }

    @action portfolioChartLoadData() {
        this.portfolioChartService.getData(this.transactionStore.transactions, this.portfolioChartSelectedFiat, this.portfolioChartSelectedCoin)
            .then(action(data => {
                this.portfolioChartData = data;
            }));
    }

    portfolioChartSetFilters(filters) {
        this.portfolioChartSelectedFiat = filters.selectedFiat;
        this.portfolioChartSelectedCoin = filters.selectedCoin;
        this.portfolioChartLoadData();
    }
}

export default PortfolioPageState;