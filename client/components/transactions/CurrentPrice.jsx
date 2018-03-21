import React from 'react';
import { inject, observer } from 'mobx-react';
import Exchange from '../common/Exchange';

@inject('exchangeStore')
@observer
class CurrentPrice extends React.Component {

    constructor(props) {

        super(props);

        this.getState = this.getState.bind(this);
        this.getValue = this.getValue.bind(this);

        this.state = this.getState(props);
    }

    componentWillReceiveProps(nextProps) {
        this.setState(this.getState(nextProps));
    }

    getState(props) {

        return {
            from: props.symbol == "USD" ? "USD" : "BTC",
            to: props.symbol,
            amount: this.getValue(props.symbol, props.transaction, props.priceIndex)
        }
    }

    getValue(symbol, transaction, priceIndex) {

        if(!priceIndex['USD'] || !priceIndex['BTC'])
            return '';

        if(symbol == 'USD')
            return this.format(priceIndex['USD'][transaction.currency])

        return this.format(priceIndex['BTC'][transaction.currency])
    }

    format(value) {
        if(value == null)
            return '';
        return 1 / value;
    }

    render() {
        return (
            <span>
                
                {!this.state.amount == '' &&
                    <Exchange amount={this.state.amount} from={this.state.from} to={this.state.to} />
                }

                {this.state.amount == '' &&
                    '?'
                }

            </span>
            
        )
    }
}
export default CurrentPrice;