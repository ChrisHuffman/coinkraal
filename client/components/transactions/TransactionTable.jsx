import React from 'react';
import { inject, observer } from 'mobx-react';
import { Table } from 'reactstrap';
import Loader from '../common/Loader'
import RemoveTransaction from './RemoveTransaction'
import AddTransaction from './AddTransaction'

@inject('transactionStore', 'commonStore')
@observer
class TransactionTable extends React.Component {

    constructor() {
        super();
    }

    render() {
        var self = this;
        return (
            <div>

                <div className="row justify-content-center">
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

                        <div className="row mt-20">
                            <div className="col-md">
                                <Table size="sm">
                                    <thead>
                                        <tr>
                                            <th>Coin</th>
                                            <th>Amount</th>
                                            <th>Price</th>
                                            <th>Date</th>
                                            <th>Remove</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.props.transactionStore.transactions.map(function (transaction) {
                                                return <tr key={transaction._id}>
                                                    <td>{transaction.in_currency}</td>
                                                    <td>{transaction.in_amount}</td>
                                                    <td>{self.props.commonStore.formatUSD(transaction.in_unitPriceUSD)}</td>
                                                    <td>{self.props.commonStore.formatDate(transaction.date)}</td>
                                                    <td><RemoveTransaction id={transaction._id} /></td>
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