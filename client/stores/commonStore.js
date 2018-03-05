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
}



export default new CommonStore();
