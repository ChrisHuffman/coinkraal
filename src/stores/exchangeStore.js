import { observable, action, computed } from 'mobx';
import agentExt from '../agent-ext';

export class ExchangeStore {

  @observable exchangeRates = {};
  loadCount = 1;

  constructor() {
  }

  load(fiats, coins) {

    var self = this;

    //Clear
    self.loadCount = 1;
    self.exchangeRates = {};

    return new Promise(function (resolve, reject) {

      fiats = fiats.map(f => f.symbol);
      coins = coins.map(f => f.symbol);

      var currencies = fiats.concat(coins);
      var allCurrencies = currencies.slice(0);

      self.loadExchange(currencies, allCurrencies, () => { self.checkComplete(resolve) });
    });
  }

  @action loadExchange(currencies, allCurrencies, resolve) {

    if (currencies.length == 0) {
      resolve();
      return;
    }

    var self = this;
    var currency = currencies.pop();

    self.beginLoadIndividualExchange(currency, allCurrencies.slice(0))
      .then(function () {
        self.loadExchange(currencies, allCurrencies.slice(0), resolve);
      });
  }

  beginLoadIndividualExchange(currency, allCurrencies) {

    var self = this;

    //Remove itself from all currencies
    allCurrencies.splice(allCurrencies.indexOf(currency), 1);

    return new Promise(function (resolve, reject) {
      self.loadIndividualExchange(currency, allCurrencies, resolve);
    });
  }

  @action loadIndividualExchange(currency, allCurrencies, resolve) {

    var self = this;

    var chunckSize = 7; //Max = 30 (7 * 3 + 7 = 28)
    var chunck = allCurrencies.splice(0, chunckSize);

    if (!self.exchangeRates[currency])
      self.exchangeRates[currency] = { };

    agentExt.External1.getPrice(currency, chunck.map(c => c))
      .then(action((rates) => {

        self.exchangeRates[currency] = Object.assign(self.exchangeRates[currency], rates);

        if (allCurrencies.length == 0)
          resolve();
        else
           self.loadIndividualExchange(currency, allCurrencies, resolve)
      }));
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