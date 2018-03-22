import { observable, action, reaction } from 'mobx';
import agent from '../agent';
import { notify } from 'react-notify-toast';
import moment from 'moment';

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

  getTransactionPrice(symbol, transaction) {

    if (transaction.purchaseCurrency == symbol)
      return transaction.purchaseUnitPrice;

    var rate = transaction.exchangeRates.rates.find((r) => {
      return r.symbol == symbol;
    })

    if (!rate)
      return '?';

    return rate.rate == 0 ? '?' : rate.rate;
  }

  getCurrentPrice(symbol, transaction, priceIndex) {

    if (!priceIndex || !priceIndex['USD'] || !priceIndex['BTC'])
      return '';

    if (symbol == 'USD')
      return {
        from: 'USD',
        amount: this.invertExchange(priceIndex['USD'][transaction.currency])
      }

    return {
      from: 'BTC',
      amount: this.invertExchange(priceIndex['BTC'][transaction.currency])
    };

  }

  invertExchange(value) {
    if (value == null)
      return '';
    return 1 / value;
  }

  getPercentageChange(sellingPrice, costPrice) {

    if(sellingPrice == costPrice)
      return 0;

    var isGain = sellingPrice > costPrice;

    if(isGain)
      return ((sellingPrice - costPrice) / costPrice) * 100;

    return -((costPrice - sellingPrice) / costPrice) * 100;
  }

}



export default CommonStore;
