import React from 'react';
import { inject, observer } from 'mobx-react';
import { Table, Button } from 'reactstrap';
import Loader from '../common/Loader'
import CoinLogo from '../common/CoinLogo'
import RemoveTransaction from './RemoveTransaction'
import EditTransaction from './EditTransaction'
import AddTransaction from './AddTransaction'
import AddSale from './AddSale'
import ChevronRight from 'react-feather/dist/icons/chevron-right';
import ChevronDown from 'react-feather/dist/icons/chevron-down';


@inject('transactionStore', 'commonStore')
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
    }

    editTransaction(transaction, event) {
        this.stopPropagation(event);
        this.props.transactionStore.toggleEditTransactionModal(transaction);
    }

    removeTransaction(transaction, event) {
        this.stopPropagation(event);
        this.props.transactionStore.toggleRemoveTransactionModal(transaction);
    }

    addSale(transaction, event) {
        this.stopPropagation(event);
        this.props.transactionStore.toggleAddSaleModal(transaction);
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
                    <Button outline color="secondary" size="xs" className="mr-10" onClick={this.addSale.bind(event, transaction)}>Sell</Button>
                    <Button outline color="secondary" size="xs" className="mr-10" onClick={this.removeTransaction.bind(event, transaction)}>Remove</Button>
                    <Button outline color="secondary" size="xs" onClick={this.editTransaction.bind(event, transaction)}>Edit</Button>
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
                        <td></td>
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
                

                <EditTransaction transaction={this.props.transactionStore.selectedTransaction} />
                <RemoveTransaction />

                <AddSale transaction={this.props.transactionStore.selectedTransaction} />

                <div className="row justify-content-center mt-20">
                    <div className="col-auto">
                        <Loader visible={this.props.transactionStore.isLoading} />
                    </div>
                </div>

                {!this.props.transactionStore.isLoading &&
                    <div>
                        <div className="row justify-content-end">
                            <div className="col-auto">
                                <AddTransaction />
                            </div>
                        </div>

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
                    </div>
                }
            </div>
        );
    }

}
export default TransactionTable;