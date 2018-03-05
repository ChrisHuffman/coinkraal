import { observable, action, reaction } from 'mobx';
import agent from '../agent';

class AuthStore {

    @observable token = window.localStorage.getItem('jwt');

    constructor() {
        reaction(
            () => this.token,
            token => {
                if (token) {
                    window.localStorage.setItem('jwt', token);
                } else {
                    window.localStorage.removeItem('jwt');
                }
            }
        );
    }

    @action googleLogin(googleTokenId) {

        return agent.Auth.login(googleTokenId)
            .then(action((data) => {
                this.token = data.token;
            }));

    }

    @action signout() {
        this.token = null;
    }

}

export default new AuthStore();
