import React from 'react';
import { inject, observer } from 'mobx-react';
import { Table, Button, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import Loader from '../common/Loader'
import CoinLogo from '../common/CoinLogo'
import RemoveTransaction from './modals/RemoveTransaction'
import EditTransaction from './modals/EditTransaction'
import AddTransaction from './modals/AddTransaction'
import AddSale from './modals/AddSale'
import EditSale from './modals/EditSale'
import RemoveSale from './modals/RemoveSale'
import TransactionPrice from './TransactionPrice'
import TransactionProfit from './TransactionProfit'
import SalePrice from './SalePrice'
import SaleProfit from './SaleProfit'
import TransactionValue from './TransactionValue'
import Number from '../common/Number'
import CurrentPrice from '../common/CurrentPrice'
import MinusSquare from 'react-feather/dist/icons/minus-square';
import PlusSquare from 'react-feather/dist/icons/plus-square';
import CommonService from '../../services/CommonService'
import Layout from '../Layout'
import Menu from 'react-feather/dist/icons/menu';

@inject('global', 'transactionsPageState', 'transactionStore', 'commonStore', 'priceStore', 'coinsPageState')
@observer
class TransactionTable extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            expandedRows: []
        };

        this.editTransaction = this.editTransaction.bind(this);
        this.removeTransaction = this.removeTransaction.bind(this);
        this.addSale = this.addSale.bind(this);
        this.editSale = this.editSale.bind(this);
        this.removeSale = this.removeSale.bind(this);
        this.coinSummary = this.coinSummary.bind(this);
    }

    editTransaction(transaction, event) {
        this.props.transactionsPageState.toggleEditTransactionModal(transaction);
    }

    removeTransaction(transaction, event) {
        this.props.transactionsPageState.toggleRemoveTransactionModal(transaction);
    }

    addSale(transaction, event) {
        this.props.transactionsPageState.toggleAddSaleModal(transaction);
    }

    editSale(transaction, sale, event) {
        this.props.transactionsPageState.toggleEditSaleModal(transaction, sale);
    }

    removeSale(transaction, sale, event) {
        this.props.transactionsPageState.toggleRemoveSaleModal(transaction, sale);
    }

    coinSummary(transaction, event) {
        this.props.coinsPageState.toggleCoinSummaryModal(transaction.currency);
    }

    handleRowClick(rowId) {
        const currentExpandedRows = this.state.expandedRows;
        const isRowCurrentlyExpanded = currentExpandedRows.includes(rowId);

        const newExpandedRows = isRowCurrentlyExpanded ?
            currentExpandedRows.filter(id => id !== rowId) :
            currentExpandedRows.concat(rowId);

        this.setState({ expandedRows: newExpandedRows });
    }

    renderTransaction(transaction) {

        var clickCallback = () => this.handleRowClick(transaction._id);

        var expander = <span />

        if (transaction.sales && transaction.sales.length > 0) {
            expander =
                <div className="text-secondary">
                    {this.state.expandedRows.includes(transaction._id) ? <MinusSquare className="align-middle" size={20} /> : <PlusSquare className="align-middle" size={20} />}
                </div>
        }

        var rows = [
            <tr key={'transaction-' + transaction._id} className='clickable'>
                <td onClick={clickCallback} className='align-middle p-1'>
                    {expander}
                </td>
                <td onClick={clickCallback} className="align-middle p-0">
                    <div className="d-none d-md-block pl-3">
                        <CoinLogo coin={transaction.currency} />
                    </div>
                </td>
                <td onClick={clickCallback} className="align-middle">{transaction.currency}</td>
                <td onClick={clickCallback} className="align-middle d-none d-sm-table-cell">
                    <div>
                        <Number amount={this.props.transactionStore.getTransactionAmountBalance(transaction)} /> <small className="text-secondary">BALANCE</small>
                    </div>
                    <div>
                        <Number amount={transaction.amount} /> <small className="text-secondary">INITIAL</small>
                    </div>
                </td>
                <td className="d-none d-sm-table-cell" onClick={clickCallback} >
                    <div>
                        <TransactionPrice symbol={this.props.global.selectedFiat} transaction={transaction} />
                        <small>&nbsp;{this.props.global.selectedFiat}</small>
                    </div>
                    <div>
                        <TransactionPrice symbol={this.props.global.selectedCoin} transaction={transaction} />
                        <small>&nbsp;{this.props.global.selectedCoin}</small>
                    </div>
                </td>
                <td className="d-none d-md-table-cell" onClick={clickCallback} >
                    <div>
                        <CurrentPrice currentSymbol={this.props.global.selectedFiat} targetSymbol={transaction.currency} priceIndex={this.props.priceStore.priceIndex} />
                        <small>&nbsp;{this.props.global.selectedFiat}</small>
                    </div>
                    <div>
                        <CurrentPrice currentSymbol={this.props.global.selectedCoin} targetSymbol={transaction.currency} priceIndex={this.props.priceStore.priceIndex} />
                        <small>&nbsp;{this.props.global.selectedCoin}</small>
                    </div>
                </td>
                <td onClick={clickCallback} >
                    <div>
                        <TransactionProfit symbol={this.props.global.selectedFiat} transaction={transaction} priceIndex={this.props.priceStore.priceIndex} />
                        <small>&nbsp;{this.props.global.selectedFiat}</small>
                    </div>
                    <div>
                        <TransactionProfit symbol={this.props.global.selectedCoin} transaction={transaction} priceIndex={this.props.priceStore.priceIndex} />
                        <small>&nbsp;{this.props.global.selectedCoin}</small>
                    </div>
                </td>
                <td onClick={clickCallback} >
                    <div>
                        <TransactionValue symbol={this.props.global.selectedFiat} transaction={transaction} priceIndex={this.props.priceStore.priceIndex} />
                        <small>&nbsp;{this.props.global.selectedFiat}</small>
                    </div>
                    <div>
                        <TransactionValue symbol={this.props.global.selectedCoin} transaction={transaction} priceIndex={this.props.priceStore.priceIndex} />
                        <small>&nbsp;{this.props.global.selectedCoin}</small>
                    </div>
                </td>
                <td onClick={clickCallback} className="align-middle d-none d-lg-table-cell">{this.props.commonStore.formatDate(transaction.date)}</td>
                <td className='align-middle d-none d-lg-table-cell'>
                    <Button outline color="secondary" size="xs" className="mr-10" onClick={this.editTransaction.bind(this, transaction)}>Edit</Button>
                    <Button outline color="secondary" size="xs" className="mr-10" onClick={this.removeTransaction.bind(this, transaction)}>Remove</Button>
                    <Button outline color="secondary" size="xs" className="mr-10" onClick={this.addSale.bind(this, transaction)}>Sell</Button>
                    <Button outline color="secondary" size="xs" onClick={this.coinSummary.bind(this, transaction)}>Coin Info</Button>
                </td>
                <td className='align-middle d-table-cell d-lg-none'>
                    <UncontrolledDropdown size="sm" className="icon-dropdown">
                        <DropdownToggle>
                            <Menu className="" size={18} />
                        </DropdownToggle>
                        <DropdownMenu right>
                            <DropdownItem onClick={this.editTransaction.bind(this, transaction)}>Edit</DropdownItem>
                            <DropdownItem onClick={this.removeTransaction.bind(this, transaction)}>Remove</DropdownItem>
                            <DropdownItem onClick={this.addSale.bind(this, transaction)}>Sell</DropdownItem>
                            <DropdownItem onClick={this.coinSummary.bind(this, transaction)}>Coin Info</DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </td>
            </tr>
        ];

        if (this.state.expandedRows.includes(transaction._id) && transaction.sales.length > 0) {

            rows.push(
                <tr key={'sale-header' + transaction._id} className="font-weight-bold sub-table-header">
                    <td></td>
                    <td colSpan="2"></td>
                    <td className="d-none d-sm-table-cell">Sale Amount</td>
                    <td className="d-none d-sm-table-cell">Sale Price</td>
                    <td className="d-none d-md-table-cell"></td>
                    <td>Sale Profit</td>
                    <td></td>
                    <td className="d-none d-lg-table-cell">Date</td>
                    <td className="d-none d-lg-table-cell"></td>
                    <td className='align-middle d-table-cell d-lg-none'></td>
                </tr>
            );

            transaction.sales.forEach(sale => {

                rows.push(
                    <tr key={'sale-' + sale._id} className="bg-dark">
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className="align-middle d-none d-sm-table-cell">{sale.amount}</td>
                        <td className="d-none d-sm-table-cell">
                            <div>
                                <SalePrice symbol={this.props.global.selectedFiat} sale={sale} />
                                <small>&nbsp;{this.props.global.selectedFiat}</small>
                            </div>
                            <div>
                                <SalePrice symbol={this.props.global.selectedCoin} sale={sale} />
                                <small>&nbsp;{this.props.global.selectedCoin}</small>
                            </div>
                        </td>
                        <td className="align-middle d-none d-md-table-cell"></td>
                        <td>
                            <div>
                                <SaleProfit symbol={this.props.global.selectedFiat} transaction={transaction} sale={sale} />
                                <small>&nbsp;{this.props.global.selectedFiat}</small>
                            </div>
                            <div>
                                <SaleProfit symbol={this.props.global.selectedCoin} transaction={transaction} sale={sale} />
                                <small>&nbsp;{this.props.global.selectedCoin}</small>
                            </div>
                        </td>
                        <td>
                        </td>
                        <td className="align-middle d-none d-lg-table-cell">{this.props.commonStore.formatDate(sale.date)}</td>
                        <td className='align-middle d-none d-lg-table-cell'>
                            <Button outline color="secondary" size="xs" className="mr-10" onClick={this.editSale.bind(event, transaction, sale)}>Edit</Button>
                            <Button outline color="secondary" size="xs" onClick={this.removeSale.bind(event, transaction, sale)}>Remove</Button>
                        </td>
                        <td className='align-middle d-table-cell d-lg-none'>
                            <UncontrolledDropdown size="sm" className="icon-dropdown">
                                <DropdownToggle>
                                    <Menu className="" size={18} />
                                </DropdownToggle>
                                <DropdownMenu right>
                                    <DropdownItem onClick={this.editSale.bind(event, transaction, sale)}>Edit</DropdownItem>
                                    <DropdownItem onClick={this.removeSale.bind(event, transaction, sale)}>Remove</DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </td>
                    </tr>
                );
            })
        }

        return rows;
    }

    render() {
        var allTransactionRows = [];

        this.props.transactionsPageState.transactions.forEach(transaction => {
            var perTransactionRows = this.renderTransaction(transaction);
            allTransactionRows = allTransactionRows.concat(perTransactionRows);
        });

        return (
            <div>

                {(!this.props.transactionStore.isLoading && this.props.transactionStore.transactions.length > 0) &&
                    <div className="row">
                        <div className="col-md">
                            <Table responsive className="mb-5">
                                <thead>
                                    <tr>
                                        <th className="clearTopBorder narrow"></th>
                                        <th colSpan="2" className="clearTopBorder">Coin</th>
                                        <th className="clearTopBorder d-none d-sm-table-cell">Amount</th>
                                        <th className="clearTopBorder d-none d-sm-table-cell">
                                            <span className="d-none d-md-block">
                                                Purchase Price
                                            </span>
                                            <span className="d-block d-md-none">
                                                Pur. Price
                                            </span>
                                        </th>
                                        <th className="clearTopBorder d-none d-md-table-cell">Current Price</th>
                                        <th className="clearTopBorder">Profit</th>
                                        <th className="clearTopBorder">Value</th>
                                        <th className="clearTopBorder d-none d-lg-table-cell">Date</th>
                                        <th className="clearTopBorder d-none d-lg-table-cell">Actions</th>
                                        <th className='clearTopBorder align-middle d-table-cell d-lg-none'>Menu</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allTransactionRows}
                                </tbody>
                            </Table>
                        </div>
                    </div>
                }

                <AddTransaction />
                <EditTransaction transaction={this.props.transactionsPageState.selectedTransaction} />
                <RemoveTransaction />

                <AddSale transaction={this.props.transactionsPageState.selectedTransaction} />
                <EditSale transaction={this.props.transactionsPageState.selectedTransaction} sale={this.props.transactionsPageState.selectedSale} />
                <RemoveSale />

                <div className="row justify-content-center">
                    <div className="col-auto">
                        <Loader visible={this.props.transactionStore.isLoading} />
                    </div>
                </div>

                <div />

            </div>
        );
    }

}
export default TransactionTable;