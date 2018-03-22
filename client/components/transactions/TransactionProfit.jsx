import React from 'react';
import { inject, observer } from 'mobx-react';
import Percentage from '../common/Percentage';

@inject('exchangeStore', 'commonStore')
@observer
class TransactionProfit extends React.Component {

    constructor(props) {
        super(props);
        this.getState = this.getState.bind(this);
        this.state = this.getState(props);
    }

    componentWillReceiveProps(nextProps) {
        this.setState(this.getState(nextProps));
    }

    getState(props) {

        var purchasePrice = props.commonStore.getTransactionPrice(props.symbol, props.transaction)

        var currentPrice = props.commonStore.getCurrentPrice(props.symbol, props.transaction, props.priceIndex);
        var currentPriceExchanged = props.exchangeStore.exchange(currentPrice.amount, currentPrice.from, props.symbol);

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
export default TransactionProfit;