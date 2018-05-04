import { observable, action, computed } from 'mobx';
import moment from 'moment';
import agent from '../agent';
import agentExt from '../agent-ext';
import Coin from '../models/Coin';

export class CoinStore {

  @observable isLoading = false;
  coins = [];

  constructor() {
  }

  @action loadCoins() {

    let self = this;
    self.isLoading = true;

    return new Promise(function (resolve, reject) {

      return agentExt.External2.getCoinTopList(0, 2000)
        .then(action((coins) => {
          self.coins = coins.map(c => {

            let coin = new Coin(c.symbol, c.name);
            coin.rank = parseInt(c.rank);
            coin.priceUsd = parseFloat(c.price_usd);
            coin.priceBtc = parseFloat(c.price_btc);
            coin.volumeUsd24h = parseFloat(c["24h_volume_usd"]);
            coin.marketCapUsd = parseFloat(c.market_cap_usd);
            coin.maxSupply = parseFloat(c.max_supply);
            coin.availableSupply = parseFloat(c.available_supply);
            coin.totalSupply = parseFloat(c.total_supply);
            coin.percentChange1h = parseFloat(c.percent_change_1h);
            coin.percentChange24h = parseFloat(c.percent_change_24h);
            coin.percentChange7d = parseFloat(c.percent_change_7d);

            return coin;
          });
          self.isLoading = false;
          resolve();
        }));
    });
  }

  

  getHistoricalPrice(fromCurrency, toCurrency, timestamp) {
    return agentExt.External1.getHistoricalPrice(fromCurrency, toCurrency, timestamp);
  }

  getUnitPrice(fromCurrency, toCurrency, date) {

    let self = this;

    return new Promise(function (resolve, reject) {

      if (!fromCurrency || !toCurrency || !date) {
        resolve('');
        return;
      }

      let now = moment();
      let dateParsed = moment(date);

      let isToday = now.diff(dateParsed, 'days') == 0;
      let unix = isToday ? now.unix() : dateParsed.unix();

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

  getCoinLinks(symbol) {

    return new Promise(function (resolve, reject) {

      return agent.Coins.getCoinLinks(symbol)
        .then((links) => {
          resolve(links);
        });
    });
  }

  get24HrPriceChange(fromCurrency, toCurrency) {
    return agentExt.External1.get24HrPriceChange(fromCurrency, toCurrency);
  }

  getCoinExchanges(fromCurrency, toCurrency, limit) {
    return agentExt.External1.getCoinExchanges(fromCurrency, toCurrency, limit);
  }

  getGlobalData() {
    return agent.Coins.getGlobalData();
  }

}

export default CoinStore;