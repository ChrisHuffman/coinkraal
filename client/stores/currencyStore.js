import { observable, action, computed } from 'mobx';
import agentExt from '../agent-ext';
import moment from 'moment';

export class CurrencyStore {

  @observable isLoading = false;
  @observable currencies = observable([]);
  @observable purchaseCurrencies = observable([]);

  constructor() {

  }

  @action loadPurchaseCurrencies() {
    this.purchaseCurrencies.replace([
      { Symbol: 'BTC', FullName: 'Bitcoin (BTC)' },
      { Symbol: 'ETH', FullName: 'Ethereum (ETH)' },
      { Symbol: 'USD', FullName: 'US Dollar (USD)' },
      { Symbol: 'EUR', FullName: 'Euro (EUR)' },
      { Symbol: 'GBP', FullName: 'Pound (GBP)' }
    ]);
  }

  @action loadCurrencies() {
    this.isLoading = true;
    return agentExt.External.getCoinDataList()
      .then(action((coins) => {
        var currencies = [];
        for (var symbol in coins) {
          if (coins.hasOwnProperty(symbol)) {
            var c = coins[symbol];
            c.SortOrder = parseInt(c.SortOrder);
            currencies.push(c);
          }
        }
        currencies.sort((a, b) => {
          return a.SortOrder - b.SortOrder;
        })
        this.currencies.replace(currencies);
      }))
      .finally(action(() => { this.isLoading = false; }));
  }

  @action getHistoricalPrice(fromCurrency, toCurrency, timestamp) {
    return agentExt.External.getHistoricalPrice(fromCurrency, toCurrency, timestamp);
  }

  getUnitPrice(fromCurrency, toCurrency, date) {

    var self = this;

    return new Promise(function (resolve, reject) {

      if (!fromCurrency || !toCurrency || !date) {
        resolve('');
        return;
      }

      var now = moment();
      var dateParsed = moment(date);

      var isToday = now.diff(dateParsed, 'days') == 0;
      var unix = isToday ? now.unix() : dateParsed.unix();

      self.getHistoricalPrice(fromCurrency, toCurrency, unix)
        .then(price => {
          resolve(price);
        });
    });
  }

}

export default new CurrencyStore();