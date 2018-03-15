import { observable, action, computed } from 'mobx';
import agentExt from '../agent-ext';

export class CoinStore {

  constructor() {
  }

  @action getCoins(start, limit) {
    return agentExt.External.getCoinTopList(start, limit)
  }

}

export default CoinStore;