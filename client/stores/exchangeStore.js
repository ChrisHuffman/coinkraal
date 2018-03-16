import { observable, action, computed } from 'mobx';
import agentExt from '../agent-ext';

export class ExchangeStore {

  constructor() {
  }

  loadData() {

    return new Promise(function (resolve, reject) {
      resolve();
    });
      
  }

  @computed getCoins(amount, source, target) {
    return amout;
  }

}

export default ExchangeStore;