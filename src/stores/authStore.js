
class AuthStore {

    constructor(agent, tokenStore) {
        this.agent = agent;
        this.tokenStore = tokenStore;
    }

    googleLogin(googleTokenId) {

        return this.agent.Auth.googleLogin(googleTokenId)
            .then((data) => {
                this.tokenStore.setToken(data.token);
                return data.isFirstLogin;
            });
    }

    facebookLogin(accessToken, email, userID, name, picture) {

        return this.agent.Auth.facebookLogin(accessToken, email, userID, name, picture)
            .then((data) => {
                this.tokenStore.setToken(data.token);
                return data.isFirstLogin;
            });
    }

}

export default AuthStore;
