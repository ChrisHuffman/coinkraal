import React from 'react';
import { inject, observer } from 'mobx-react';
import { Table, Button } from 'reactstrap';
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
        this.stopPropagation(event);
        this.props.transactionsPageState.toggleEditTransactionModal(transaction);
    }

    removeTransaction(transaction, event) {
        this.stopPropagation(event);
        this.props.transactionsPageState.toggleRemoveTransactionModal(transaction);
    }

    addSale(transaction, event) {
        this.stopPropagation(event);
        this.props.transactionsPageState.toggleAddSaleModal(transaction);
    }

    editSale(transaction, sale, event) {
        this.stopPropagation(event);
        this.props.transactionsPageState.toggleEditSaleModal(transaction, sale);
    }

    removeSale(transaction, sale, event) {
        this.stopPropagation(event);
        this.props.transactionsPageState.toggleRemoveSaleModal(transaction, sale);
    }

    stopPropagation(event) {
        event.stopPropagation();
        event.nativeEvent.stopImmediatePropagation();
    }

    coinSummary(transaction, event) {
        this.stopPropagation(event);
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
            <tr onClick={clickCallback} key={'transaction-' + transaction._id} className='clickable'>
                <td className='align-middle'>
                    {expander}
                </td>
                <td className="align-middle">
                    <CoinLogo coin={transaction.currency} />
                </td>
                <td className="align-middle">{transaction.currency}</td>
                <td className="align-middle">
                    <div>
                        <Number amount={CommonService.getTransactionAmountBalance(transaction)} /> <small className="text-secondary">CURRENT</small>
                    </div>
                    <div>
                        <Number amount={transaction.amount} /> <small className="text-secondary">INITIAL</small>
                    </div>
                </td>
                <td>
                    <div>
                        <TransactionPrice symbol={this.props.global.selectedFiat} transaction={transaction} />
                        <small>&nbsp;{this.props.global.selectedFiat}</small>
                    </div>
                    <div>
                        <TransactionPrice symbol={this.props.global.selectedCoin} transaction={transaction} />
                        <small>&nbsp;{this.props.global.selectedCoin}</small>
                    </div>
                </td>
                <td>
                    <div>
                        <CurrentPrice currentSymbol={this.props.global.selectedFiat} targetSymbol={transaction.currency} priceIndex={this.props.priceStore.priceIndex} />
                        <small>&nbsp;{this.props.global.selectedFiat}</small>
                    </div>
                    <div>
                        <CurrentPrice currentSymbol={this.props.global.selectedCoin} targetSymbol={transaction.currency} priceIndex={this.props.priceStore.priceIndex} />
                        <small>&nbsp;{this.props.global.selectedCoin}</small>
                    </div>
                </td>
                <td>
                    <div>
                        <TransactionProfit symbol={this.props.global.selectedFiat} transaction={transaction} priceIndex={this.props.priceStore.priceIndex} />
                        <small>&nbsp;{this.props.global.selectedFiat}</small>
                    </div>
                    <div>
                        <TransactionProfit symbol={this.props.global.selectedCoin} transaction={transaction} priceIndex={this.props.priceStore.priceIndex} />
                        <small>&nbsp;{this.props.global.selectedCoin}</small>
                    </div>
                </td>
                <td>
                    <div>
                        <TransactionValue symbol={this.props.global.selectedFiat} transaction={transaction} priceIndex={this.props.priceStore.priceIndex} />
                        <small>&nbsp;{this.props.global.selectedFiat}</small>
                    </div>
                    <div>
                        <TransactionValue symbol={this.props.global.selectedCoin} transaction={transaction} priceIndex={this.props.priceStore.priceIndex} />
                        <small>&nbsp;{this.props.global.selectedCoin}</small>
                    </div>
                </td>
                <td className="align-middle">{this.props.commonStore.formatDate(transaction.date)}</td>
                <td className='align-middle'>
                    <Button outline color="secondary" size="xs" className="mr-10" onClick={this.editTransaction.bind(this, transaction)}>Edit</Button>
                    <Button outline color="secondary" size="xs" className="mr-10" onClick={this.removeTransaction.bind(this, transaction)}>Remove</Button>
                    <Button outline color="secondary" size="xs" className="mr-10" onClick={this.addSale.bind(this, transaction)}>Sell</Button>
                    <Button outline color="secondary" size="xs" onClick={this.coinSummary.bind(this, transaction)}>Coin Info</Button>
                </td>
            </tr>
        ];

        if (this.state.expandedRows.includes(transaction._id) && transaction.sales.length > 0) {

            rows.push(
                <tr key={'sale-header' + transaction._id} className="font-weight-bold sub-table-header">
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>Sale Amount</td>
                    <td>Sale Price</td>
                    <td></td>
                    <td>Sale Profit</td>
                    <td></td>
                    <td>Date</td>
                    <td></td>
                </tr>
            );

            transaction.sales.forEach(sale => {

                rows.push(
                    <tr key={'sale-' + sale._id} className="bg-dark">
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className="align-middle">{sale.amount}</td>
                        <td>
                            <div>
                                <SalePrice symbol={this.props.global.selectedFiat} sale={sale} />
                                <small>&nbsp;{this.props.global.selectedFiat}</small>
                            </div>
                            <div>
                                <SalePrice symbol={this.props.global.selectedCoin} sale={sale} />
                                <small>&nbsp;{this.props.global.selectedCoin}</small>
                            </div>
                        </td>
                        <td className="align-middle"></td>
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
                        <td className="align-middle">{this.props.commonStore.formatDate(sale.date)}</td>
                        <td className='align-middle'>
                            <Button outline color="secondary" size="xs" className="mr-10" onClick={this.editSale.bind(event, transaction, sale)}>Edit</Button>
                            <Button outline color="secondary" size="xs" onClick={this.removeSale.bind(event, transaction, sale)}>Remove</Button>
                        </td>
                    </tr>
                );
            })
        }

        return rows;
    }

    render() {
        var allTransactionRows = [];

        this.props.transactionStore.transactions.forEach(transaction => {
            var perTransactionRows = this.renderTransaction(transaction);
            allTransactionRows = allTransactionRows.concat(perTransactionRows);
        });

        return (
            <div>

                {!this.props.transactionStore.isLoading &&
                    <div className="row">
                        <div className="col-md">
                            <Table responsive>
                                <thead>
                                    <tr>
                                        <th className="clearTopBorder narrow"></th>
                                        <th className="clearTopBorder narrow">Coin</th>
                                        <th className="clearTopBorder"></th>
                                        <th className="clearTopBorder">Amount</th>
                                        <th className="clearTopBorder">Purchase Price</th>
                                        <th className="clearTopBorder">Current Price</th>
                                        <th className="clearTopBorder">Profit</th>
                                        <th className="clearTopBorder">Value</th>
                                        <th className="clearTopBorder">Date</th>
                                        <th className="clearTopBorder">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allTransactionRows}
                                </tbody>
                            </Table>
                        </div>
                    </div>
                }

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

            </div>
        );
    }

}
export default TransactionTable;