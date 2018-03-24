import React from 'react';
import { inject, observer } from 'mobx-react';
import Currency from '../common/Currency';

@inject('commonStore')
@observer
class TransactionSummaryPrice extends React.Component {

    constructor(props) {
        super(props);
        this.getState = this.getState.bind(this);
        this.state = this.getState(props);

    }

    componentWillReceiveProps(nextProps) {
        this.setState(this.getState(nextProps));
    }

    getState(props) {

        return {
            value: this.props.commonStore.getExchangeRate(props.symbol, props.transactionSummary.purchaseCurrency, props.transactionSummary.averagePurchaseUnitPrice, props.transactionSummary.averagedExchangeRates)
        }
    }

    render() {
        return (
            <Currency amount={this.state.value} />
        )
    }
}
export default TransactionSummaryPrice;