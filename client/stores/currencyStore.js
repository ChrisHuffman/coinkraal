import { observable, action, computed } from 'mobx';
import agent from '../agent';
import agentExt from '../agent-ext';
import moment from 'moment';

export class CurrencyStore {

  @observable isLoading = false;
  coins = [];
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

  @action loadCoins() {

    var self = this;
    self.isLoading = true;

    return new Promise(function (resolve, reject) {

      return agent.Coins.getCoins()
      .then(action((coins) => {
        self.coins = coins.map(c => {
          c.fullName = `${c.name} (${c.symbol})`;
          return c;
        });
        self.isLoading = false; 
        resolve();
      }));
    });
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

  getCoin(symbol) {
    return this.coins.find(function (c) {
      return c.symbol == symbol;
    });
  }

}

export default CurrencyStore;