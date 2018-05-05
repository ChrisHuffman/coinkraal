import { observable, action, reaction, computed } from 'mobx';

export class PortfolioPageState {

    @observable portfolioChartData = {};
    @observable portfolioRawData = {};
    portfolioChartSelectedTimeRange = 90;
    @observable isLoadingPorfolioChartData = true;

    @observable transactionSummaries = [];
    @observable pageIndex = 0;
    pageSize = 7;

    @observable coinRiskChartData = {};

    constructor(global, transactionStore, priceStore, portfolioChartService, transactionSummaryService, coinRiskChartService, chartJsService, utilityService) {

        this.global = global;
        this.transactionStore = transactionStore;
        this.priceStore = priceStore;
        this.portfolioChartService = portfolioChartService;
        this.transactionSummaryService = transactionSummaryService;
        this.coinRiskChartService = coinRiskChartService;
        this.chartJsService = chartJsService;
        this.utilityService = utilityService;

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

        let currency1 = this.global.selectedFiat;
        let currency2 = this.global.selectedCoin;

        this.portfolioChartService.getData(this.transactionStore.transactions.slice(), currency1, currency2, this.portfolioChartSelectedTimeRange)
            .then(action(data => {

                let dataPoints = data.dataPoints;

                if (dataPoints.length == 0) {
                    this.isLoadingPorfolioChartData = false;
                    return;
                }

                let datasets = [];
                let dataPoints1 = dataPoints[0];
                let dataPoints2 = dataPoints[1];

                if (dataPoints1) {
                    let values = dataPoints1.map(dp => dp.getTotal());
                    datasets.push(this.chartJsService.getLineChartJsDataset(values, currency1, this.utilityService.getCurrencyColour(currency1), "y-axis-1"));
                }

                if (dataPoints2) {
                    let values = dataPoints2.map(dp => dp.getTotal());
                    datasets.push(this.chartJsService.getLineChartJsDataset(values, currency2, this.utilityService.getCurrencyColour(currency2), "y-axis-2"));
                }

                this.portfolioChartData = {
                    data: {
                        labels: this.getChartJsLabels(dataPoints1, dataPoints2),
                        datasets: datasets
                    },
                    options: this.chartJsService.getLineChartJsOptions(dataPoints1, dataPoints2, currency1, currency2, data.dataFrequency),
                    plugins: [this.chartJsService.getVerticalLinePlugin()]
                };

                this.portfolioRawData = {
                    fiat: dataPoints1,
                    coin: dataPoints2
                }

                this.isLoadingPorfolioChartData = false;
            }));
    }

    getChartJsLabels(dataPoints1, dataPoints2) {
        let arr = dataPoints1 ? dataPoints1 : dataPoints2;

        if (!arr)
            return [];

        return arr.map(dp => dp.date);
    }

    @action loadCoinRishChartData() {

        this.coinRiskChartService.getData(this.transactionSummaries)
            .then(action(dataPoints => {

                let dataset = this.chartJsService.getPieChartJsDataset(dataPoints.map(d => d.value));

                this.coinRiskChartData = {
                    data: {
                        labels: dataPoints.map(d => d.label),
                        datasets: [dataset]
                    },
                    options: this.chartJsService.getPieChartJsOptions()
                }

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
        let start = this.pageIndex * this.pageSize;
        let page = this.transactionSummaries.slice(start, start + this.pageSize);
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