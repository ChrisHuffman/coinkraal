import { observable, action, computed } from 'mobx';
import agent from '../agent';

export class UserStore {
  
  constructor() {
  }

  getSettings() {
    return agent.User.getSettings();
  }

  updateSettings(settings) {
    return agent.User.updateSettings(settings)
  }

}

export default UserStore;