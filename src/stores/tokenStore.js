import { observable, action, reaction } from 'mobx';
import agent from '../agent';

class TokenStore {

    @observable
    token = window.localStorage.getItem('jwt');

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

    @action signout() {
        this.token = null;
    }

    @action setToken(token) {
        this.token = token;
    }

    authorizeRequest(req) {
        if (this.token) {
            req.set('Authorization', `Bearer ${tokenStore.token}`);
        }
    }

    handleHttpErrors(err) {
        if (err && err.response && err.response.status === 401) {
            this.signout();
        }
        return err;
    }

}

export default TokenStore;
