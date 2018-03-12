import { observable, action, computed } from 'mobx';
import agent from '../agent';

export class SocialStore {
  
  constructor() {
  }

  getRedditContent(url) {

    return agent.Social.getRedditContent(url)
      .then(html => {
        return html;
      });
  }

}

export default SocialStore;