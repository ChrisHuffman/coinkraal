import React from 'react';
import ReactDOM from 'react-dom';
import { Switch, Route, withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import Notifications from 'react-notify-toast';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';

import Header from './common/Header'
import TransactionTable from './transactions/TransactionTable'
import CoinTable from './coins/CoinTable'
import PortfolioChart from './charts/portfolio/PortfolioChart'

@inject('authStore', 'commonStore', 'transactionStore', 'currencyStore')
@withRouter
@observer
export default class Home extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      activeTab: '1'
    };

    this.props.transactionStore.loadTransactions();
    this.props.currencyStore.loadCurrencies();
    this.props.currencyStore.loadPurchaseCurrencies();

    this.toggle = this.toggle.bind(this);
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  render() {

    return (
      <div>

        <Notifications options={{ zIndex: 5000, timeout: 15000 }} />

        <Header />

        <div className="mb-10" />

        <div className="container-fluid">

        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '1' })}
              onClick={() => { this.toggle('1'); }}>
              Portfolio
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '2' })}
              onClick={() => { this.toggle('2'); }}>
              Transactions
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '3' })}
              onClick={() => { this.toggle('3'); }}>
              Coins
            </NavLink>
          </NavItem>
        </Nav>

        

          <TabContent activeTab={this.state.activeTab}>
            <TabPane tabId="1">

              <div className="row mt-20">
                <div className="col-md-7">
                  <PortfolioChart />
                </div>
                <div className="col-md-5">

                </div>
              </div>

            </TabPane>

            <TabPane tabId="2">
              <TransactionTable />
            </TabPane>

            <TabPane tabId="3">
              <CoinTable />
            </TabPane>
          </TabContent>

        </div>

      </div>
    );
  }
}