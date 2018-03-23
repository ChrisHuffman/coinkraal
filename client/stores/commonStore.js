import { observable, action, reaction } from 'mobx';
import agent from '../agent';
import { notify } from 'react-notify-toast';
import moment from 'moment';
import { BigNumber } from 'bignumber.js';

class CommonStore {

  constructor() {
  }

  @action notify(message, type) {
    notify.show(message, type);
  }

  getUnixTimeStamp(date) {
    return new Date(date).getTime() / 1000;
  }

  formatDate(date) {
    return moment(date).format('ll');
  }

  formatUSD(amount) {
    return parseFloat(amount).toLocaleString('en-us', { style: 'currency', currency: 'USD' });
  }

  getErrorMessage(errors, fieldName, message) {
    var error = errors[fieldName];
    if (!error)
      return '';
    return message || error.message;
  }

  getErrorClass(errors, fieldName) {
    var error = errors[fieldName];
    if (!error)
      return '';
    return 'is-invalid';
  }

  getExchangeRate(symbol, toSymbol, price, exchangeRates) {

    if (symbol == toSymbol)
      return price;

    var rate = exchangeRates.rates.find((r) => {
      return r.symbol == symbol;
    })

    if (!rate)
      return '?';

    return rate.rate == 0 ? '?' : rate.rate;
  }

  getCurrentPrice(symbol, currency, priceIndex) {

    if (!priceIndex || !priceIndex['USD'] || !priceIndex['BTC'])
      return '';

    if (symbol == 'USD')
      return {
        from: 'USD',
        amount: this.invertExchange(priceIndex['USD'][currency])
      }

    return {
      from: 'BTC',
      amount: this.invertExchange(priceIndex['BTC'][currency])
    };
  }

  invertExchange(value) {
    if (value == null)
      return '';
    return new BigNumber(1).dividedBy(value).toNumber();
  }

  getPercentageChange(sellingPrice, costPrice) {

    if(isNaN(sellingPrice) || isNaN(costPrice))
      return ""

    var sp = new BigNumber(sellingPrice.toString());
    var cp = new BigNumber(costPrice.toString());

    if(sp.isEqualTo(cp))
      return 0;

    var isGain = sp.isGreaterThan(costPrice);

    if(isGain)
      return sp.minus(cp).dividedBy(cp).multipliedBy(100).toNumber();

    return cp.minus(sp).dividedBy(costPrice).multipliedBy(-100).toNumber();
  }

}



export default CommonStore;
