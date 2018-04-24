import React from 'react';
import { inject, observer } from 'mobx-react';
import Number from '../common/Number';

@inject('commonStore', 'exchangeStore')
@observer
class TransactionSummaryValue extends React.Component {

    constructor(props) {
        super(props);
        this.getState = this.getState.bind(this);
        this.state = this.getState(props);
    }

    componentWillReceiveProps(nextProps) {
        this.setState(this.getState(nextProps));
    }

    getState(props) {

        let currentPrice = props.commonStore.getCurrentPrice(props.symbol, props.summary.currency, props.priceIndex);
        let exchanged = props.exchangeStore.exchange(currentPrice.amount, currentPrice.from, props.symbol);

        return {
            value: exchanged * props.summary.totalAmount
        }
    }

    render() {
        return (
            <Number amount={this.state.value} />
        )
    }
}
export default TransactionSummaryValue;