import React from 'react';
import ReactDOM from 'react-dom';
import { Switch, Route, withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import GoogleLogin from 'react-google-login';


@inject('authStore')
@withRouter
@observer
export default class Login extends React.Component {

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

                <h3 className="display-4 text-center mt-30">CoinKraal</h3>

                <div className="row justify-content-md-center mt-40">
                    <div className="col-md-auto">
                        <GoogleLogin
                            clientId="438822097741-eo7be3r2pk4preadlqmblhsskvfh6jmk.apps.googleusercontent.com" //DEV
                            //clientId="617395409011-nc7n22gtcg46nig91pe45s5on4uf9p8d.apps.googleusercontent.com" //PROD
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

