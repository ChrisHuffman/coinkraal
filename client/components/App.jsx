import React from 'react';
import ReactDOM from 'react-dom';
import { Switch, Route, withRouter } from 'react-router-dom';
import { observer, inject } from 'mobx-react';

import SettingsPage from './settings/SettingsPage'
import PortfolioPage from './portfolio/PortfolioPage'
import CoinsPage from './coins/CoinsPage'
import TransactionsPage from './transactions/TransactionsPage'
import Login from './common/Login'
import Login2 from './common/Login2'
import SecureRoute from './common/SecureRoute'

@withRouter
export default class App extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    return (
      <div>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/login2" component={Login2} />
          <SecureRoute path="/settings" component={SettingsPage} />
          <SecureRoute path="/transactions" component={TransactionsPage} />
          <SecureRoute path="/portfolio" component={PortfolioPage} />
          <SecureRoute path="/" component={CoinsPage} />
        </Switch>
      </div>
    );

  }
}