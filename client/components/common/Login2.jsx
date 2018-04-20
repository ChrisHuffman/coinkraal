import React from 'react';
import ReactDOM from 'react-dom';
import { Switch, Route, withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'


@inject('global', 'authStore')
@withRouter
@observer
export default class Login2 extends React.Component {

    googleClientId = __GOOGLE_CLIENT_ID__;
    facebookClientId = __FACEBOOK_CLIENT_ID__;

    constructor(props) {
        super(props);
        this.responseGoogle = this.responseGoogle.bind(this);
        this.responseFacebook = this.responseFacebook.bind(this);
        this.handleResponse = this.handleResponse.bind(this);
    }

    responseGoogle(response) {
        this.props.authStore.googleLogin(response.tokenId)
            .then(this.handleResponse);
    }

    responseFacebook(response) {

        this.props.authStore.facebookLogin(response.accessToken, response.email, response.userID, response.name, response.picture.data.url)
            .then(this.handleResponse);
    }

    handleResponse(isFirstLogin) {
        if (isFirstLogin) {
            this.props.global.isFirstLogin = true;
            this.props.history.push("/settings");
        }
        else {
            this.props.history.push("/");
        }
    }

    render() {

        return (
            <div>

                <div className="row justify-content-center mt-5">
                    <div className="col-8 col-sm-5 col-md-3 col-lg-2">
                        <img src="logo_full.png" width="100%" />
                    </div>
                </div>

                <div className="row justify-content-center mt-4 mb-3">
                    <div className="col-auto">
                        <p className="text-muted font-italic">
                            keep those cryptos in check
                        </p>
                    </div>
                </div>

                <div className="row justify-content-center mt-5">

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


                <div className="row justify-content-center mt-3">

                    <div className="col-auto">
                        <FacebookLogin
                            appId={this.facebookClientId}
                            autoLoad={true}
                            fields="name,email,picture"
                            callback={this.responseFacebook} 
                            render={renderProps => (
                                <button className="btn btn-outline-primary" onClick={renderProps.onClick}>Sign in with Facebook</button>
                              )}
                        />
                    </div>

                </div>


            </div>
        );
    }
}

