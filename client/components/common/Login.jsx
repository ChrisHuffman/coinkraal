import React from 'react';
import ReactDOM from 'react-dom';
import { Switch, Route, withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import GoogleLogin from 'react-google-login';


@inject('authStore')
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
                this.props.history.push("/");
            });
    }

    render() {

        return (
            <div>

                <div className="row justify-content-center mt-5">
                    <div className="col-8 col-sm-5 col-md-3 col-lg-2">
                        <img src="logo_full.png" width="100%" />
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

            </div>
        );
    }
}

