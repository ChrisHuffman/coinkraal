import { observable, action, computed } from 'mobx';
import agentExt from '../agent-ext';

export class ExchangeStore {

  @observable exchangeRates = {};
  loadCount = 2;

  constructor() {
  }

  load(fiats, coins) {

    var self = this;

    return new Promise(function (resolve, reject) {

      //Clone lists
      var allFiats = fiats.slice(0);
      self.loadExchange(fiats, allFiats, () => { self.checkComplete(resolve) });

      //Clone lists
      var allCoins = coins.slice(0);
      self.loadExchange(coins, allCoins, () => { self.checkComplete(resolve) });
    });
  }

  loadExchange(currencies, allCurrencies, resolve) {

    if (currencies.length == 0) {
      resolve();
      return;
    }

    var self = this;
    var currency = currencies.pop();

    self.loadIndividualExchange(currency, allCurrencies)
      .then(() => {
        self.loadExchange(currencies, allCurrencies, resolve);
      });
  }

  loadIndividualExchange(currency, allCurrencies) {

    var self = this;

    return new Promise(function (resolve, reject) {

      agentExt.External.getPrice(currency, allCurrencies)
        .then(rates => {
          self.exchangeRates[currency] = rates;
          resolve();
        });

    });
  }

  checkComplete(resolve) {
    this.loadCount--;

    if (this.loadCount == 0) {
      //console.log('Loaded exchanges: ', this.exchangeRates);
      resolve();
    }
  }

  exchange(amount, from, to) {

    if (from == to)
      return amount;

    var source = this.exchangeRates[from];

    if (!source)
      return 'loading';

    var rate = source[to];

    if (!rate)
      return 'loading';

    //console.log(from + ':' + to + ' -> ' + (amount * rate));

    return amount * rate;
  }

}

export default ExchangeStore;