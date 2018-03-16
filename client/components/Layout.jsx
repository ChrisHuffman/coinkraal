import React from 'react';
import { inject, observer } from 'mobx-react';
import ReactDOM from 'react-dom';
import { NavLink as RRNavLink, Link } from 'react-router-dom';
import Notifications from 'react-notify-toast';
import { Nav, NavItem, NavLink } from 'reactstrap';
import Header from './common/Header'
import Loader from './common/Loader'

@inject('global')
@observer
export default class Layout extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    return (
      <div>

        <Notifications options={{ zIndex: 5000, timeout: 15000 }} />

        {this.props.global.isLoaded &&

          <div>

            <Header />

            <div className="mb-10" />

            <div className="container-fluid">

              <Nav tabs>
                <NavItem>
                  <NavLink activeClassName='active' tag={RRNavLink} exact to='/'>
                    Portfolio
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink activeClassName='active' tag={RRNavLink} exact to='/transactions'>
                    Transactions
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink activeClassName='active' tag={RRNavLink} exact to='/coins'>
                    Coins
                </NavLink>
                </NavItem>
              </Nav>

              {this.props.children}

            </div>

          </div>
        }

        {!this.props.global.isLoaded &&
          <div className="container-fluid">
            <div className="row justify-content-center">
              <div className="col-auto mt-40">
                {/* <Loader visible={!this.props.global.isLoaded} /> */}
                loading....
              </div>
            </div>
          </div>
        }

      </div>
    );
  }
}