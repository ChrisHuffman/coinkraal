import { observable, action, computed } from 'mobx';
import agentExt from '../agent-ext';

export class CoinStore {

  @observable selectedCoin = null;
  @observable coinSummaryModal = false;

  constructor() {
  }

  @action getCoins(start, limit) {
    return agentExt.External.getCoinTopList(0, 100)
  }

  @action toggleCoinSummaryModal(coin) {
    this.selectedCoin = coin;
    this.coinSummaryModal = !this.coinSummaryModal;
  }

}

export default CoinStore;