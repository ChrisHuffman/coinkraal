import React from 'react';
import ReactDOM from 'react-dom';
import { Switch, Route, withRouter } from 'react-router-dom';
import { observer, inject } from 'mobx-react';

import PortfolioPage from './portfolio/PortfolioPage'
import CoinsPage from './coins/CoinsPage'
import TransactionsPage from './transactions/TransactionsPage'
import Login from './common/Login'
import SecureRoute from './common/SecureRoute'

@inject('authStore', 'commonStore', 'transactionStore', 'currencyStore')
@withRouter
@observer
export default class App extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    return (
      <div>
        <Switch>
          <Route path="/login" component={Login} />
          <SecureRoute path="/transactions" component={TransactionsPage} />
          <SecureRoute path="/coins" component={CoinsPage} />
          <SecureRoute path="/" component={PortfolioPage} />
        </Switch>
      </div>
    );

  }
}