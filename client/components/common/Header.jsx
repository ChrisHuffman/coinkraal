import React from 'react';
import { inject, observer } from 'mobx-react';
import VirtualizedSelect from 'react-virtualized-select';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem,
            NavLink, UncontrolledDropdown, DropdownToggle, DropdownMenu,DropdownItem,
            ButtonDropdown, Button } from 'reactstrap';
import LogOut from 'react-feather/dist/icons/log-out';

@inject('global', 'authStore', 'coinStore', 'coinsPageState')
class Header extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isOpen: false,

            selectedFiat: props.global.selectedFiat,
            selectedCoin: props.global.selectedCoin
        };

        this.toggle = this.toggle.bind(this);
        this.signout = this.signout.bind(this);
        this.handleCoinChange = this.handleCoinChange.bind(this);

        this.toggleFiatDropDown = this.toggleFiatDropDown.bind(this);
        this.selectFiat = this.selectFiat.bind(this);

        this.toggleCoinDropDown = this.toggleCoinDropDown.bind(this);
        this.selectCoin = this.selectCoin.bind(this);
    }

    signout() {
        this.props.authStore.signout();
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    handleCoinChange(newValue) {
        this.props.coinsPageState.toggleCoinSummaryModal(newValue);
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
            <Navbar color="faded" light expand="md">
                <NavbarBrand href="/">
                    <img src="logo_2.png" height="25" />
                </NavbarBrand>
                <NavbarToggler onClick={this.toggle} />
                <Collapse isOpen={this.state.isOpen} navbar>

                    <form className="ml-auto form-inline my-2 my-lg-0">

                        <ButtonDropdown className="mr-2" isOpen={this.state.fiatDropDownOpen} toggle={this.toggleFiatDropDown}>
                            <DropdownToggle caret>
                                {this.state.selectedFiat}
                            </DropdownToggle>
                            <DropdownMenu>
                                {
                                    this.props.global.fiatOptions.map(fiat => {
                                        return <DropdownItem key={fiat.symbol} onClick={this.selectFiat.bind(null, fiat.symbol)}>{fiat.symbol}</DropdownItem>
                                    })
                                }
                            </DropdownMenu>
                        </ButtonDropdown>

                        <ButtonDropdown className="mr-2" isOpen={this.state.coinDropDownOpen} toggle={this.toggleCoinDropDown}>
                            <DropdownToggle caret>
                                {this.state.selectedCoin}
                            </DropdownToggle>
                            <DropdownMenu>
                                {
                                    this.props.global.coinOptions.map(coin => {
                                        return <DropdownItem key={coin.symbol} onClick={this.selectCoin.bind(null, coin.symbol)}>{coin.symbol}</DropdownItem>
                                    })
                                }
                            </DropdownMenu>
                        </ButtonDropdown>

                        <VirtualizedSelect
                            placeholder="Find Coin..."
                            className="header-select mt-2 mt-sm-0 mr-2"
                            options={this.props.coinStore.coins}
                            searchable={true}
                            simpleValue={true}
                            clearable={true}
                            onChange={this.handleCoinChange}
                            labelKey="fullName"
                            valueKey="symbol"
                        />

                        <LogOut className="text-secondary clickable" onClick={this.signout} />

                    </form>
                </Collapse>
            </Navbar>
        )
    }
}
export default Header;