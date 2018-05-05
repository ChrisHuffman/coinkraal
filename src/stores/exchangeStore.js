import { observable, action, computed } from 'mobx';

export class ExchangeStore {

  @observable exchangeRates = {};
  loadCount = 1;

  constructor(agent) {
    this.agent = agent;
  }

  load(fiats, coins) {

    //Clear
    this.loadCount = 1;
    this.exchangeRates = {};

    return new Promise((resolve, reject) => {

      fiats = fiats.map(f => f.symbol);
      coins = coins.map(f => f.symbol);

      let currencies = fiats.concat(coins);
      let allCurrencies = currencies.slice(0);

      this.loadExchange(currencies, allCurrencies, () => { this.checkComplete(resolve) });
    });
  }

  @action loadExchange(currencies, allCurrencies, resolve) {

    if (currencies.length == 0) {
      resolve();
      return;
    }

    let currency = currencies.pop();

    this.beginLoadIndividualExchange(currency, allCurrencies.slice(0))
      .then(() => {
        this.loadExchange(currencies, allCurrencies.slice(0), resolve);
      });
  }

  beginLoadIndividualExchange(currency, allCurrencies) {

    //Remove itself from all currencies
    allCurrencies.splice(allCurrencies.indexOf(currency), 1);

    return new Promise((resolve, reject) => {
      this.loadIndividualExchange(currency, allCurrencies, resolve);
    });
  }

  @action loadIndividualExchange(currency, allCurrencies, resolve) {

    let chunckSize = 7; //Max = 30 (7 * 3 + 7 = 28)
    let chunck = allCurrencies.splice(0, chunckSize);

    if (!this.exchangeRates[currency])
      this.exchangeRates[currency] = { };

    this.agent.CryptoCompare.getPrice(currency, chunck.map(c => c))
      .then(action((rates) => {

        this.exchangeRates[currency] = Object.assign(this.exchangeRates[currency], rates);

        if (allCurrencies.length == 0)
          resolve();
        else
          this.loadIndividualExchange(currency, allCurrencies, resolve)
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

    let source = this.exchangeRates[from];

    if (!source)
      return 'loading';

    let rate = source[to];

    if (!rate)
      return 'loading';

    //console.log(from + ':' + to + ' -> ' + (amount * rate));

    return amount * rate;
  }
}

export default ExchangeStore;