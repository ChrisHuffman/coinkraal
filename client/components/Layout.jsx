import React from 'react';
import { inject, observer } from 'mobx-react';
import ReactDOM from 'react-dom';
import { NavLink as RRNavLink, Link } from 'react-router-dom';
import Notifications from 'react-notify-toast';
import { Nav, NavItem, NavLink, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import Header from './common/Header'
import Loader from './common/Loader'
import CoinSummary from './coins/CoinSummary/CoinSummary'

@inject('global', 'coinsPageState')
@observer
export default class Layout extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedFiat: props.global.selectedFiat,
      selectedCoin: props.global.selectedCoin,
    }

    this.toggleFiatDropDown = this.toggleFiatDropDown.bind(this);
    this.selectFiat = this.selectFiat.bind(this);

    this.toggleCoinDropDown = this.toggleCoinDropDown.bind(this);
    this.selectCoin = this.selectCoin.bind(this);
  }

  toggleFiatDropDown() {
    this.setState({
      fiatDropDownOpen: !this.state.fiatDropDownOpen
    });
  }

  selectFiat(fiat) {
    this.setState({
      selectedFiat: fiat
    });
    this.props.global.setSelectedFiat(fiat);
  }

  toggleCoinDropDown() {
    this.setState({
      coinDropDownOpen: !this.state.coinDropDownOpen
    });
  }

  selectCoin(coin) {
    this.setState({
      selectedCoin: coin
    });
    this.props.global.setSelectedCoin(coin);
  }

  render() {

    return (
      <div>

        <Notifications options={{ zIndex: 5000, timeout: 15000 }} />

        {this.props.global.isLoaded &&

          <div>

            <Header />

            <div className="container-fluid">

              <div className="row justify-content-end">
                <div className="col-auto">

                  <ButtonDropdown isOpen={this.state.fiatDropDownOpen} toggle={this.toggleFiatDropDown}>
                    <DropdownToggle caret>
                      {this.state.selectedFiat}
                    </DropdownToggle>
                    <DropdownMenu>
                      {
                        this.props.global.fiatOptions.map(fiat => {
                          return <DropdownItem key={fiat} onClick={this.selectFiat.bind(null, fiat)}>{fiat}</DropdownItem>
                        })
                      }
                    </DropdownMenu>
                  </ButtonDropdown>

                </div>
                <div className="col-auto">

                  <ButtonDropdown isOpen={this.state.coinDropDownOpen} toggle={this.toggleCoinDropDown}>
                    <DropdownToggle caret>
                      {this.state.selectedCoin}
                    </DropdownToggle>
                    <DropdownMenu>
                      {

                        this.props.global.coinOptions.map(coin => {

                          return <DropdownItem key={coin} onClick={this.selectCoin.bind(null, coin)}>{coin}</DropdownItem>
                        })
                      }
                    </DropdownMenu>
                  </ButtonDropdown>

                </div>
              </div>


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

          <CoinSummary coinSymbol={this.props.coinsPageState.selectedCoinSymbol} />

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