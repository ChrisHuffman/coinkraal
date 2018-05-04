import React from 'react';
import { inject, observer } from 'mobx-react';
import { DropdownToggle, DropdownMenu, DropdownItem, UncontrolledButtonDropdown, Button } from 'reactstrap';
import Filter from 'react-feather/dist/icons/filter';
import Square from 'react-feather/dist/icons/square';
import CheckSquare from 'react-feather/dist/icons/check-square';

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
                    <UncontrolledButtonDropdown size="sm" className="ml-2 icon-dropdown">
                        <DropdownToggle className="btn-outline-secondary">
                            <Filter size={18} />
                        </DropdownToggle>
                        <DropdownMenu right>
                            <DropdownItem onClick={this.toggleZeroBalanceTransactions}>
                                Show Zero Balance Transactions
                                {!this.props.transactionsPageState.showZeroBalanceTransactions &&
                                    <Square className="item-icon" size={16} />
                                }
                                {this.props.transactionsPageState.showZeroBalanceTransactions &&
                                    <CheckSquare className="item-icon" size={16} />
                                }
                        </DropdownItem>
                        </DropdownMenu>
                    </UncontrolledButtonDropdown>
                }
            </div>
        );
    }
}
export default TransactionTableControls;
