import React from 'react';
import ReactDOM from 'react-dom';
import { Switch, Route, withRouter } from 'react-router-dom';
import { observer, inject } from 'mobx-react';

import PortfolioPage from './portfolio/PortfolioPage'
import CoinTable from './coins/CoinTable'
import TransactionTable from './transactions/TransactionTable'
import Login from './common/Login'
import SecureRoute from './common/SecureRoute'

@inject('authStore', 'commonStore', 'transactionStore', 'currencyStore')
@withRouter
@observer
export default class App extends React.Component {

  constructor(props) {
    super(props);

    if (props.authStore.token) {
      this.props.currencyStore.loadCurrencies();
      this.props.currencyStore.loadPurchaseCurrencies();
      this.props.transactionStore.loadTransactions();
    }
  }

  render() {

    return (
      <div>
        <Switch>
          <Route path="/login" component={Login} />
          <SecureRoute path="/transactions" component={TransactionTable} />
          <SecureRoute path="/coins" component={CoinTable} />
          <SecureRoute path="/" component={PortfolioPage} />
        </Switch>
      </div>
    );

  }
}