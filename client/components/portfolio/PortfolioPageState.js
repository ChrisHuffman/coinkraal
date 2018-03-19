import { observable, observe, action, reaction, computed } from 'mobx';

export class PortfolioPageState {

    transactionStore = null;
    portfolioChartService = null;

    @observable portfolioChartData = { };
    @observable portfolioRawData = { };
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
}

export default PortfolioPageState;