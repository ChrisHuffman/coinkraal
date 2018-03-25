import React from 'react';
import { inject, observer } from 'mobx-react';
import Number from '../common/Number';
import CommonService from '../../services/CommonService'

@inject('commonStore', 'exchangeStore', 'transactionStore')
@observer
class PortfolioValue extends React.Component {

    constructor(props) {
        super(props);
        this.getState = this.getState.bind(this);
        this.state = this.getState(props);
    }

    componentWillReceiveProps(nextProps) {
        this.setState(this.getState(nextProps));
    }

    getState(props) {

        var total = 0;

        props.transactions.forEach(transaction => {

            var currentPrice = props.commonStore.getCurrentPrice(props.symbol, transaction.currency, props.priceIndex);
            var exchanged = props.exchangeStore.exchange(currentPrice.amount, currentPrice.from, props.symbol);
            
            total += (exchanged * CommonService.getTransactionAmountBalance(transaction));
        });

        return {
            total: total
        }
    }

    render() {
        return (
            <Number amount={this.state.total} />
        )
    }
}
export default PortfolioValue;