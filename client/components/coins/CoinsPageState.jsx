import { observable, action } from 'mobx';

export class CoinsPageState {

    @observable selectedCoin = null;
    @observable coinSummaryModal = false;

    coinChartService = null;
    @observable coinChartData = {};

    constructor(coinChartService) {
        this.coinChartService = coinChartService;
    }

    @action toggleCoinSummaryModal(coin) {
        this.selectedCoin = coin;
        this.coinSummaryModal = !this.coinSummaryModal;
    }

    @action loadCoinChartData(coin) {

        console.log('CoinsPageState: loadCoinChartData() 1', coin)
        this.coinChartService.getData(coin)
            .then(action(data => {
                console.log('CoinsPageState: loadCoinChartData() 2', data)
                this.coinChartData = data;
            }));

    }
}

export default CoinsPageState;