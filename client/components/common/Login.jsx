import React from 'react';
import ReactDOM from 'react-dom';
import { Switch, Route, withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import GoogleLogin from 'react-google-login';


@inject('authStore', 'transactionStore', 'currencyStore')
@withRouter
@observer
export default class Login extends React.Component {

    googleClientId = __GOOGLE_CLIENT_ID__;

    constructor(props) {
        super(props);
        this.responseGoogle = this.responseGoogle.bind(this);
    }

    responseGoogle(response) {

        this.props.authStore.googleLogin(response.tokenId)
            .then(() => {
                this.props.currencyStore.loadCoins();
                this.props.currencyStore.loadPurchaseCurrencies();
                this.props.transactionStore.loadTransactions();
                this.props.history.push("/");
            });
    }

    render() {

        return (
            <div>

                <h3 className="display-4 text-center mt-30">CoinKraal</h3>

                <div className="row justify-content-center mt-40">
                    <div className="col-auto">
                        <GoogleLogin
                            clientId={this.googleClientId}
                            buttonText="Sign in with Google"
                            className="btn btn-outline-danger"
                            onSuccess={this.responseGoogle}
                            onFailure={this.responseGoogle}
                        />
                    </div>
                </div>

            </div>
        );
    }
}

