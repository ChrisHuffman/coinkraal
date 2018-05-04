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

@inject('global', 'priceStore', 'portfolioPageState', 'coinsPageState')
@observer
class TransactionSummaryTable extends React.Component {

    constructor(props) {
        super(props);
        this.coinSummary = this.coinSummary.bind(this);
    }

    coinSummary(currency, event) {
        this.props.coinsPageState.toggleCoinSummaryModal(currency);
    }

    render() {

        let self = this;
        let transactionSummaries = this.props.portfolioPageState.transactions;

        return (
            <div>
                <Table responsive className="mb-5">
                    <thead>
                        <tr>
                            <th className="clearTopBorder narrow d-none d-sm-table-cell">
                                Coin
                            </th>
                            <th className="clearTopBorder">
                                <span className="d-block d-sm-none">
                                    Coin
                                </span>
                            </th>
                            <th className="clearTopBorder">Amount</th>
                            <th className="clearTopBorder d-none d-sm-table-cell">
                                <span className="d-none d-md-block">
                                    Avg. Purchase Price
                                </span>
                                <span className="d-block d-md-none">
                                    Avg. Pur. Price
                                </span>
                            </th>
                            <th className="clearTopBorder d-none d-md-table-cell">Current Price</th>
                            <th className="clearTopBorder">Profit</th>
                            <th className="clearTopBorder">Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            transactionSummaries.map(function (summary) {
                                return <tr key={summary.currency}>
                                    <td className="align-middle d-none d-sm-table-cell clickable" onClick={self.coinSummary.bind(this, summary.currency)}>
                                        <CoinLogo coin={summary.currency} />
                                    </td>
                                    <td className="align-middle clickable" onClick={self.coinSummary.bind(this, summary.currency)}>{summary.currency}</td>
                                    <td className="align-middle">
                                        <Number amount={summary.totalAmount} />
                                    </td>
                                    <td className="d-none d-sm-table-cell">
                                        <div>
                                            <TransactionSummaryPrice symbol={self.props.global.selectedFiat} transactionSummary={summary} />
                                            <small>&nbsp;{self.props.global.selectedFiat}</small>
                                        </div>
                                        <div>
                                            <TransactionSummaryPrice symbol={self.props.global.selectedCoin} transactionSummary={summary} />
                                            <small>&nbsp;{self.props.global.selectedCoin}</small>
                                        </div>
                                    </td>
                                    <td className="d-none d-md-table-cell">
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