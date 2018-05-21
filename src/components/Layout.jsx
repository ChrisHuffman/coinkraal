import React from 'react';
import { inject, observer } from 'mobx-react';
import ReactDOM from 'react-dom';
import { NavLink as RRNavLink, Link } from 'react-router-dom';
import Notifications from 'react-notify-toast';
import { Nav, NavItem, NavLink } from 'reactstrap';
import Header from './common/Header'
import Loader from './common/Loader'

import CoinSummaryModal from './coins/CoinSummary/CoinSummaryModal'

@inject('global', 'coinsPageState')
@observer
export default class Layout extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

  

    return (
      <div>

        <Notifications options={{ zIndex: 5000, timeout: 15000 }} />

        {!this.props.global.isLoading &&

          <div>

            <Header />

            <div className="container-fluid mt-3">

              <Nav tabs>
                <NavItem>
                  <NavLink activeClassName='active' tag={RRNavLink} exact to='/'>
                    Coins
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink activeClassName='active' tag={RRNavLink} exact to='/portfolio'>
                    Portfolio
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink activeClassName='active' tag={RRNavLink} exact to='/transactions'>
                    Transactions
                  </NavLink>
                </NavItem>
              </Nav>

              {this.props.children}

            </div>

          <CoinSummaryModal coinSymbol={this.props.coinsPageState.selectedCoinSymbol} />

          </div>
        }

        {this.props.global.isLoading &&
          <div className="container-fluid">
            <div className="row justify-content-center">
              <div className="col-auto mt-40">
                loading....
              </div>
            </div>
          </div>
        }

        

      </div>
    );
  }
}