import React from 'react';
import { inject, observer } from 'mobx-react';
import Percentage from '../common/Percentage';

@inject('exchangeStore', 'commonStore')
@observer
class TransactionSummaryProfit extends React.Component {

    constructor(props) {
        super(props);
        this.getState = this.getState.bind(this);
        this.state = this.getState(props);
    }

    componentWillReceiveProps(nextProps) {
        this.setState(this.getState(nextProps));
    }

    getState(props) {

        let purchasePrice = props.commonStore.getExchangeRate(props.symbol, props.summary.purchaseCurrency, props.summary.averagePurchaseUnitPrice, props.summary.averagedExchangeRates)

        let currentPrice = props.commonStore.getCurrentPrice(props.symbol, props.summary.currency, props.priceIndex);
        let currentPriceExchanged = props.exchangeStore.exchange(currentPrice.amount, currentPrice.from, props.symbol);

        return {
            value: props.commonStore.getPercentageChange(currentPriceExchanged, purchasePrice)
        }
    }

    render() {
        return (
            <Percentage value={this.state.value} />
        )
    }
}
export default TransactionSummaryProfit;