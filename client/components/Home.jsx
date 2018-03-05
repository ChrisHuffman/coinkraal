import React from 'react';
import ReactDOM from 'react-dom';
import { Switch, Route, withRouter } from 'react-router-dom';
import axios from 'axios';
import { inject, observer } from 'mobx-react';
import Notifications from 'react-notify-toast';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';

import Logout from './common/Logout'
import TransactionTable from './transactions/TransactionTable'
import CoinTable from './coins/CoinTable'
import PortfolioChart from './charts/PortfolioChart'

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

        <h3 className="display-4 text-center mt-20">CoinKraal</h3>

        <div className="row justify-content-md-center mb-30">
          <div className="col-md-auto">

          </div>
          <div className="col-md-auto">
            <Logout />
          </div>
        </div>


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
              Coins
            </NavLink>
          </NavItem>
        </Nav>

        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="1">

            <div className="row mt-20">
              <div className="col-md-6">
                <PortfolioChart />
              </div>
              <div className="col-md-6">
                <TransactionTable />
              </div>
            </div>

          </TabPane>
          <TabPane tabId="2">
            <CoinTable />
          </TabPane>
        </TabContent>
      </div>
    );
  }
}