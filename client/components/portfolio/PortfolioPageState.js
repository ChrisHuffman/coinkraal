import { observable, observe, action } from 'mobx';

export class PortfolioPageState {

    transactionStore = null;
    portfolioChartService = null;

    @observable portfolioChartData = { };
    
    constructor(transactionStore, portfolioChartService) {

        this.transactionStore = transactionStore;
        this.portfolioChartService = portfolioChartService;
        
        observe(transactionStore.transactions, () => {
            this.loadPortfolioChartData();
        });
    }

    @action loadPortfolioChartData() {
        this.portfolioChartService.getData(this.transactionStore.transactions)
            .then(action(data => {
                this.portfolioChartData = data;
            }));

    }
}

export default PortfolioPageState;