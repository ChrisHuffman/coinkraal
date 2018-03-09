import React from 'react';
import { inject, observer } from 'mobx-react';
import { Table, Button } from 'reactstrap';
import Loader from '../common/Loader'
import RemoveTransaction from './RemoveTransaction'
import EditTransaction from './EditTransaction'
import AddTransaction from './AddTransaction'
import AddSale from './AddSale'

@inject('transactionStore', 'commonStore')
@observer
class TransactionTable extends React.Component {

    constructor(props) {
        super(props);

        this.editTransaction = this.editTransaction.bind(this);
        this.removeTransaction = this.removeTransaction.bind(this);
        this.addSale = this.addSale.bind(this);
    }

    editTransaction(transaction) {
        this.props.transactionStore.toggleEditTransactionModal(transaction);
    }

    removeTransaction(transaction) {
        this.props.transactionStore.toggleRemoveTransactionModal(transaction);
    }

    addSale(transaction) {
        this.props.transactionStore.toggleAddSaleModal(transaction);
    }

    render() {
        var self = this;
        return (
            <div>

                <EditTransaction transaction={self.props.transactionStore.selectedTransaction} />
                <RemoveTransaction />

                <AddSale transaction={self.props.transactionStore.selectedTransaction} />

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
                                <Table size="sm">
                                    <thead>
                                        <tr>
                                            <th className="clearTopBorder">Coin</th>
                                            <th className="clearTopBorder">Amount</th>
                                            <th className="clearTopBorder">Purchased with</th>
                                            <th className="clearTopBorder">Date</th>
                                            <th className="clearTopBorder">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.props.transactionStore.transactions.map(function (transaction) {
                                                return <tr key={transaction._id}>
                                                    <td>{transaction.currency}</td>
                                                    <td>{transaction.amount}</td>
                                                    <td>{transaction.purchaseCurrency} @ {transaction.purchaseUnitPrice}</td>
                                                    <td>{self.props.commonStore.formatDate(transaction.date)}</td>
                                                    <td>
                                                        <Button outline color="secondary" size="xs" className="mr-10" onClick={self.addSale.bind(null, transaction)}>Sell</Button>
                                                        <Button outline color="secondary" size="xs" className="mr-10" onClick={self.removeTransaction.bind(null, transaction)}>Remove</Button>
                                                        <Button outline color="secondary" size="xs" onClick={self.editTransaction.bind(null, transaction)}>Edit</Button>
                                                    </td>
                                                </tr>
                                            })
                                        }
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