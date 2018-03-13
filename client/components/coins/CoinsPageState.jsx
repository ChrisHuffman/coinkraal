import { observable, action } from 'mobx';

export class CoinsPageState {

    @observable selectedCoin = null;
    @observable coinSummaryModal = false;
    
    constructor() {
    }

    @action toggleCoinSummaryModal(coin) {
        this.selectedCoin = coin;
        this.coinSummaryModal = !this.coinSummaryModal;
    }
}

export default CoinsPageState;