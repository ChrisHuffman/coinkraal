import { observable, action, computed } from 'mobx';
import agent from '../agent';
import agentExt from '../agent-ext';
import moment from 'moment';

export class CurrencyStore {

  purchaseCurrencies = [];

  constructor() {

  }

  @action loadPurchaseCurrencies() {

    var self = this;
    return new Promise(function (resolve, reject) {

      self.purchaseCurrencies = [
        { symbol: 'BTC', fullName: 'Bitcoin (BTC)' },
        { symbol: 'ETH', fullName: 'Ethereum (ETH)' },
        { symbol: 'USD', fullName: 'US Dollar (USD)' },
        { symbol: 'EUR', fullName: 'Euro (EUR)' },
        { symbol: 'GBP', fullName: 'Pound (GBP)' }
      ];

      resolve();

    });
  }

}

export default CurrencyStore;