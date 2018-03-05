import React from 'react';
import ReactDOM from 'react-dom';
import { Switch, Route, withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Button } from 'reactstrap';

@inject('authStore')
@withRouter
@observer
export default class Logout extends React.Component {

    constructor(props) {
        super(props);
        this.logout = this.logout.bind(this);
    }

    logout() {
        this.props.authStore.signout();
    }

    render() {

        return (
            <div>

               <Button outline color="secondary" size="sm" onClick={this.logout}>Sign out</Button>

            </div>
        );
    }
}

