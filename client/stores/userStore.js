import { observable, action, computed } from 'mobx';
import agent from '../agent';

export class UserStore {
  
  constructor() {
  }

  getUser() {
    return agent.User.getUser();
  }

  updateSettings(settings) {
    return agent.User.updateSettings(settings)
  }

}

export default UserStore;