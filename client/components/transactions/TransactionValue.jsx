import React from 'react';
import { inject, observer } from 'mobx-react';
import Number from '../common/Number';
import CommonService from '../../services/CommonService'

@inject('commonStore', 'exchangeStore', 'transactionStore')
@observer
class TransactionValue extends React.Component {

    constructor(props) {
        super(props);
        this.getState = this.getState.bind(this);
        this.state = this.getState(props);
    }

    componentWillReceiveProps(nextProps) {
        this.setState(this.getState(nextProps));
    }

    getState(props) {

        var currentPrice = props.commonStore.getCurrentPrice(props.symbol, props.transaction.currency, props.priceIndex);
        var exchanged = props.exchangeStore.exchange(currentPrice.amount, currentPrice.from, props.symbol);

        return {
            value: exchanged * this.props.transactionStore.getTransactionAmountBalance(props.transaction)
        }
    }

    render() {
        return (
            <Number amount={this.state.value} />
        )
    }
}
export default TransactionValue;