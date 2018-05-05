import { observable, action, computed } from 'mobx';

export class SocialStore {
  
  constructor(agent) {
    this.agent = agent;
  }

  getRedditContent(url) {

    return this.agent.Social.getRedditContent(url)
      .then(html => {
        return html;
      });
  }

}

export default SocialStore;