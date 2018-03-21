import React from 'react';
import { inject, observer } from 'mobx-react';
import Currency from '../common/Currency';

@observer
class TransactionPrice extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: this.getValue(props.symbol, props.transaction)
        }
    }

    componentWillReceiveProps(nextProps) {

        this.setState({
            value: this.getValue(nextProps.symbol, nextProps.transaction)
        });
    }

    getValue(symbol, transaction) {

        if(transaction.purchaseCurrency == symbol)
            return transaction.purchaseUnitPrice;

        var rate = transaction.exchangeRates.rates.find((r) => {
            return r.symbol == symbol;
        })

        if(!rate)
            return '?';

        return rate.rate;
    }

    render() {
        return (
            <Currency amount={this.state.value} />
        )
    }
}
export default TransactionPrice;