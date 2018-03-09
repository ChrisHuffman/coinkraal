import { observable, action, reaction } from 'mobx';
import agent from '../agent';
import { notify } from 'react-notify-toast';
import moment from 'moment';

class CommonStore {

  @observable appName = 'CoinKraal';
  @observable appLoaded = false;

  constructor() {
  }

  @action setAppLoaded() {
    this.appLoaded = true;
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
}



export default new CommonStore();
