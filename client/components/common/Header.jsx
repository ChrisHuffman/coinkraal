import React from 'react';
import { inject, observer } from 'mobx-react';
import VirtualizedSelect from 'react-virtualized-select';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from 'reactstrap';

@inject('authStore', 'coinStore', 'coinsPageState')
class Header extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isOpen: false
        };

        this.toggle = this.toggle.bind(this);
        this.logout = this.logout.bind(this);
        this.handleCoinChange = this.handleCoinChange.bind(this);
    }

    logout() {
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

    render() {
        return (
            <Navbar color="faded" light expand="md">
                <NavbarBrand href="/">
                    CoinKraal
                </NavbarBrand>
                <NavbarToggler onClick={this.toggle} />
                <Collapse isOpen={this.state.isOpen} navbar>
                    <Nav className="mr-auto" navbar>
                        <NavItem>
                            <NavLink href="#" onClick={this.logout}>Sign out</NavLink>
                        </NavItem>
                    </Nav>

                    <form className="form-inline my-2 my-lg-0">
                        
                        <VirtualizedSelect 
                            placeholder="Find Coin..."
                            className="header-select" 
                            options={this.props.coinStore.coins}
                            searchable={true}
                            simpleValue={true}
                            clearable={true}
                            onChange={this.handleCoinChange}
                            labelKey="fullName"
                            valueKey="symbol"
                        />

                    </form>
                </Collapse>
            </Navbar>
        )
    }
}
export default Header;