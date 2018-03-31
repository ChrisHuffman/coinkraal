import React from 'react';
import { inject, observer } from 'mobx-react';
import { DropdownToggle, DropdownMenu, DropdownItem, ButtonDropdown, Button } from 'reactstrap';
import Filter from 'react-feather/dist/icons/filter';

@inject('transactionStore', 'transactionsPageState')
@observer
class TransactionTableControls extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            optionsDropDownOpen: false
        }

        this.nextPage = this.nextPage.bind(this);
        this.previousPage = this.previousPage.bind(this);
        this.addTransaction = this.addTransaction.bind(this);

        this.toggleOptionsDropDown = this.toggleOptionsDropDown.bind(this);
        this.toggleZeroBalanceTransactions = this.toggleZeroBalanceTransactions.bind(this);
    }

    nextPage() {
        this.props.transactionsPageState.nextPage();
    }

    previousPage() {
        this.props.transactionsPageState.previousPage();
    }

    addTransaction() {
        this.props.transactionsPageState.toggleAddTransactionModal();
    }

    toggleOptionsDropDown() {
        this.setState({
            optionsDropDownOpen: !this.state.optionsDropDownOpen
        });
    }

    toggleZeroBalanceTransactions() {
        this.props.transactionsPageState.toggleZeroBalanceTransactions();
    }

    render() {
        return (
            <div>
                <Button outline color="primary" size="sm" onClick={this.addTransaction}>Add Transaction</Button>

                {!this.props.transactionsPageState.isFirstPage &&
                    <Button outline color="secondary" className="ml-2" size="sm" onClick={this.previousPage}>&#x3C; Previous 10</Button>
                }

                {!this.props.transactionsPageState.isLastPage &&
                    <Button outline color="secondary" size="sm" className="ml-2" onClick={this.nextPage}>Next 10 &#x3E;</Button>
                }

                {this.props.transactionStore.transactions.length > 0 &&
                    <ButtonDropdown size="sm" className="ml-2 icon-dropdown" isOpen={this.state.optionsDropDownOpen} toggle={this.toggleOptionsDropDown}>
                        <DropdownToggle>
                            <Filter className="" size={18} />
                        </DropdownToggle>
                        <DropdownMenu right>
                            <DropdownItem onClick={this.toggleZeroBalanceTransactions}>
                                {!this.props.transactionsPageState.showZeroBalanceTransactions &&
                                    'Show '
                                }
                                {this.props.transactionsPageState.showZeroBalanceTransactions &&
                                    'Hide '
                                }
                                Zero Balance Transactions
                        </DropdownItem>
                        </DropdownMenu>
                    </ButtonDropdown>
                }
            </div>
        );
    }
}
export default TransactionTableControls;
