import { observable, action, computed } from 'mobx';
import agent from '../agent';
import agentExt from '../agent-ext';
import moment from 'moment';

export class CurrencyStore {

  @observable isLoading = false;
  currencies = [];
  purchaseCurrencies = [];

  constructor() {

  }

  @action loadPurchaseCurrencies() {
    this.purchaseCurrencies = [
      { symbol: 'BTC', fullName: 'Bitcoin (BTC)' },
      { symbol: 'ETH', fullName: 'Ethereum (ETH)' },
      { symbol: 'USD', fullName: 'US Dollar (USD)' },
      { symbol: 'EUR', fullName: 'Euro (EUR)' },
      { symbol: 'GBP', fullName: 'Pound (GBP)' }
    ];
  }

  @action loadCurrencies() {
    this.isLoading = true;
    return agent.Coins.getCoins()
      .then(action((coins) => {
        console.log('currencies loaded 1.')
        this.currencies = coins.map(c => {
          c.fullName = `${c.name} (${c.symbol})`;
          return c;
        });
        console.log('currencies loaded 2.')
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

  getCurrency(symbol) {
    return this.currencies.find(function(c) {
      return c.symbol == symbol;
    });
  }

}

export default CurrencyStore;