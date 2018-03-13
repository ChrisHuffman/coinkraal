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
import ChevronRight from 'react-feather/dist/icons/chevron-right';
import ChevronDown from 'react-feather/dist/icons/chevron-down';
import Layout from '../Layout'

@inject('transactionsPageState', 'transactionStore', 'commonStore')
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

    handleRowClick(rowId) {
        const currentExpandedRows = this.state.expandedRows;
        const isRowCurrentlyExpanded = currentExpandedRows.includes(rowId);

        const newExpandedRows = isRowCurrentlyExpanded ?
            currentExpandedRows.filter(id => id !== rowId) :
            currentExpandedRows.concat(rowId);

        this.setState({ expandedRows: newExpandedRows });
    }

    renderTransaction(transaction) {

        const clickCallback = () => this.handleRowClick(transaction._id);
        const rows = [
            <tr onClick={clickCallback} key={'transaction-' + transaction._id} className='clickable'>
                <td className='min-padding'>
                    {this.state.expandedRows.includes(transaction._id) ? <ChevronDown size={22} /> : <ChevronRight size={22} />}
                </td>
                <td>
                    <CoinLogo coin={transaction.currency} />
                </td>
                <td>{transaction.currency}</td>
                <td>{transaction.amount}</td>
                <td>{transaction.purchaseCurrency} @ {transaction.purchaseUnitPrice}</td>
                <td>{this.props.commonStore.formatDate(transaction.date)}</td>
                <td className='min-padding'>
                    <Button outline color="secondary" size="xs" className="mr-10" onClick={this.editTransaction.bind(event, transaction)}>Edit</Button>
                    <Button outline color="secondary" size="xs" className="mr-10" onClick={this.removeTransaction.bind(event, transaction)}>Remove</Button>
                    <Button outline color="secondary" size="xs" onClick={this.addSale.bind(event, transaction)}>Sell</Button>
                </td>
            </tr>
        ];

        if (this.state.expandedRows.includes(transaction._id)) {

            transaction.sales.forEach(sale => {

                rows.push(
                    <tr key={'sale-' + sale._id}>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>{sale.amount}</td>
                        <td>{sale.saleCurrency} @ {sale.saleUnitPrice}</td>
                        <td>{this.props.commonStore.formatDate(sale.date)}</td>
                        <td className='min-padding'>
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
        let allTransactionRows = [];

        this.props.transactionStore.transactions.forEach(transaction => {
            const perTransactionRows = this.renderTransaction(transaction);
            allTransactionRows = allTransactionRows.concat(perTransactionRows);
        });

        return (
            <div>

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

                {!this.props.transactionStore.isLoading &&
                    <div className="row mt-10">
                        <div className="col-md">
                            <Table responsive>
                                <thead>
                                    <tr>
                                        <th className="clearTopBorder"></th>
                                        <th className="clearTopBorder">Coin</th>
                                        <th className="clearTopBorder"></th>
                                        <th className="clearTopBorder">Amount</th>
                                        <th className="clearTopBorder">Purchased with</th>
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
            </div>
        );
    }

}
export default TransactionTable;