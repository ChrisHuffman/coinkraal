import React from 'react';
import ReactDOM from 'react-dom';
import { Switch, Route, withRouter } from 'react-router-dom';
import { observer, inject } from 'mobx-react';

import SettingsPage from './settings/SettingsPage'
import PortfolioPage from './portfolio/PortfolioPage'
import CoinsPage from './coins/CoinsPage'
import TransactionsPage from './transactions/TransactionsPage'
import Login from './common/Login'
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
          <Route path="/settings" component={SettingsPage} />
          <Route path="/transactions" component={TransactionsPage} />
          <Route path="/portfolio" component={PortfolioPage} />
          <Route path="/" component={CoinsPage} />
        </Switch>
      </div>
    );

  }
}