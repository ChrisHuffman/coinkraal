import { observable, action, computed } from 'mobx';

export class UserStore {
  
  constructor(agent) {
    this.agent = agent;
  }

  getUser() {
    return this.agent.User.getUser();
  }

  updateSettings(settings) {
    return this.agent.User.updateSettings(settings)
  }

}

export default UserStore;