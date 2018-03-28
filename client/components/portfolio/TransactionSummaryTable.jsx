import React from 'react';
import { inject, observer } from 'mobx-react';
import Currency from '../common/Currency'
import { Table } from 'reactstrap';
import CoinLogo from '../common/CoinLogo'
import Number from '../common/Number'
import CurrentPrice from '../common/CurrentPrice'
import TransactionSummaryPrice from './TransactionSummaryPrice'
import TransactionSummaryProfit from './TransactionSummaryProfit'
import TransactionSummaryValue from './TransactionSummaryValue'

@inject('global', 'priceStore', 'portfolioPageState')
@observer
class TransactionSummaryTable extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        var self = this;
        var transactionSummaries = this.props.portfolioPageState.transactionSummaries;

        return (
            <div>
                <Table responsive>
                    <thead>
                        <tr>
                            <th className="clearTopBorder narrow">Coin</th>
                            <th className="clearTopBorder"></th>
                            <th className="clearTopBorder">Amount</th>
                            <th className="clearTopBorder">Avg Purchase Price</th>
                            <th className="clearTopBorder">Current Price</th>
                            <th className="clearTopBorder">Profit</th>
                            <th className="clearTopBorder">Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            transactionSummaries.map(function (summary) {
                                return <tr key={summary.currency}>
                                    <td className="align-middle"><CoinLogo coin={summary.currency} /></td>
                                    <td className="align-middle">{summary.currency}</td>
                                    <td className="align-middle">
                                        <Number amount={summary.totalAmount} />
                                    </td>
                                    <td>
                                        <div>
                                            <TransactionSummaryPrice symbol={self.props.global.selectedFiat} transactionSummary={summary} />
                                            <small>&nbsp;{self.props.global.selectedFiat}</small>
                                        </div>
                                        <div>
                                            <TransactionSummaryPrice symbol={self.props.global.selectedCoin} transactionSummary={summary} />
                                            <small>&nbsp;{self.props.global.selectedCoin}</small>
                                        </div>
                                    </td>
                                    <td>
                                        <div>
                                            <CurrentPrice currentSymbol={self.props.global.selectedFiat} targetSymbol={summary.currency} priceIndex={self.props.priceStore.priceIndex} />
                                            <small>&nbsp;{self.props.global.selectedFiat}</small>
                                        </div>
                                        <div>
                                            <CurrentPrice currentSymbol={self.props.global.selectedCoin} targetSymbol={summary.currency} priceIndex={self.props.priceStore.priceIndex} />
                                            <small>&nbsp;{self.props.global.selectedCoin}</small>
                                        </div>
                                    </td>
                                    <td>
                                        <div>
                                            <TransactionSummaryProfit symbol={self.props.global.selectedFiat} summary={summary} priceIndex={self.props.priceStore.priceIndex} />
                                            <small>&nbsp;{self.props.global.selectedFiat}</small>
                                        </div>
                                        <div>
                                            <TransactionSummaryProfit symbol={self.props.global.selectedCoin} summary={summary} priceIndex={self.props.priceStore.priceIndex} />
                                            <small>&nbsp;{self.props.global.selectedCoin}</small>
                                        </div>
                                    </td>
                                    <td>
                                        <div>
                                            <TransactionSummaryValue symbol={self.props.global.selectedFiat} summary={summary} priceIndex={self.props.priceStore.priceIndex} />
                                            <small>&nbsp;{self.props.global.selectedFiat}</small>
                                        </div>
                                        <div>
                                            <TransactionSummaryValue symbol={self.props.global.selectedCoin} summary={summary} priceIndex={self.props.priceStore.priceIndex} />
                                            <small>&nbsp;{self.props.global.selectedCoin}</small>
                                        </div>
                                    </td>
                                </tr>
                            })
                        }
                    </tbody>
                </Table>
            </div>
        );
    }
}
export default TransactionSummaryTable;