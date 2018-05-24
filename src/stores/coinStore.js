import { observable, action, computed } from 'mobx';
import moment from 'moment';
import Coin from '../models/Coin';

export class CoinStore {

  @observable isLoading = false;
  coins = [];

  constructor(agent) {
    this.agent = agent;
  }

  @action loadCoins() {

    this.isLoading = true;

    return new Promise((resolve, reject) => {

      //return this.agent.CoinMarketCap.getFullCoinList()
      return this.agent.CoinMarketCap.getCoinTopList(0, 2000)
        .then(action((coins) => {

          this.coins = coins.map(c => {

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

          // this.coins = coins.map(c => {

          //   let coin = new Coin(c.symbol, c.name);
          //   coin.rank = c.rank;
          //   coin.priceUsd = c.priceUsd;
          //   coin.volumeUsd24h = c.volumeUsd24h;
          //   coin.marketCapUsd = c.marketCapUsd;
          //   coin.maxSupply = c.maxSupply;
          //   coin.availableSupply = c.availableSupply;
          //   coin.totalSupply = c.totalSupply;
          //   coin.percentChange1h = c.percentChange1h;
          //   coin.percentChange24h = c.percentChange24h;
          //   coin.percentChange7d = c.percentChange7d;

          //   return coin;
          // });

          this.isLoading = false;

          resolve();
        }));
    });
  }

  

  getHistoricalPrice(fromCurrency, toCurrency, timestamp) {
    return this.agent.CryptoCompare.getHistoricalPrice(fromCurrency, toCurrency, timestamp);
  }

  getUnitPrice(fromCurrency, toCurrency, date) {

    return new Promise((resolve, reject) => {

      if (!fromCurrency || !toCurrency || !date) {
        resolve('');
        return;
      }

      let now = moment();
      let dateParsed = moment(date);

      let isToday = now.diff(dateParsed, 'days') == 0;
      let unix = isToday ? now.unix() : dateParsed.unix();

      this.getHistoricalPrice(fromCurrency, toCurrency, unix)
        .then(price => {
          resolve(price);
        });
    });
  }

  getCoin(symbol) {
    return this.coins.find((c) => {
      return c.symbol == symbol;
    });
  }

  getCoinLinks(symbol) {

    return new Promise((resolve, reject) => {
      return this.agent.Coin.getCoinLinks(symbol)
        .then((links) => {
          resolve(links);
        });
    });
  }

  get24HrPriceChange(fromCurrency, toCurrency) {
    return this.agent.CryptoCompare.get24HrPriceChange(fromCurrency, toCurrency);
  }

  getCoinExchanges(fromCurrency, toCurrency, limit) {
    return this.agent.CryptoCompare.getCoinExchanges(fromCurrency, toCurrency, limit);
  }

  getGlobalData() {
    return this.agent.Coin.getGlobalData();
  }

}

export default CoinStore;