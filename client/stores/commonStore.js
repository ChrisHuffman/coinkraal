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

  formatDate(date) {
    return moment(date).format('ll');
  }

  getErrorMessage(errors, fieldName, hide) {
    var error = errors[fieldName];
    if (!error || hide)
      return '';
    return error.message;
  }

  getErrorClass(errors, fieldName, hide) {
    var error = errors[fieldName];
    if (!error || hide)
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

    return rate.rate;
  }

  getCurrentPrice(currentSymbol, targetSymbol, priceIndex) {

    if (!priceIndex || !priceIndex['USD'] || !priceIndex['BTC'])
      return '';

    if (currentSymbol == 'USD')
      return {
        from: 'USD',
        amount: this.invertExchange(priceIndex['USD'][targetSymbol])
      }

    return {
      from: 'BTC',
      amount: this.invertExchange(priceIndex['BTC'][targetSymbol])
    };
  }

  invertExchange(value) {
    if (value == null)
      return '';
    return new BigNumber(1).dividedBy(value.toString()).toNumber();
  }

  getPercentageChange(sellingPrice, costPrice) {

    if(this.isNaN(sellingPrice) || this.isNaN(costPrice))
      return ""

    var sp = new BigNumber(sellingPrice.toString());
    var cp = new BigNumber(costPrice.toString());

    if (sp.isEqualTo(cp))
      return 0;

    var isGain = sp.isGreaterThan(cp);

    if (isGain)
      return sp.minus(cp).dividedBy(cp).multipliedBy(100).toNumber();

    return cp.minus(sp).dividedBy(cp).multipliedBy(-100).toNumber();
  }

  isNaN(number) {

    if (number === "")
      return true;

    return isNaN(number);
  }

}

export default CommonStore;
