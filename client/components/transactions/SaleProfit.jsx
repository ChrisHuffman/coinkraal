import React from 'react';
import { inject, observer } from 'mobx-react';
import Percentage from '../common/Percentage';

@inject('exchangeStore', 'commonStore')
@observer
class SaleProfit extends React.Component {

    constructor(props) {
        super(props);
        this.getState = this.getState.bind(this);
        this.state = this.getState(props);
    }

    componentWillReceiveProps(nextProps) {
        this.setState(this.getState(nextProps));
    }

    getState(props) {

        let purchasePrice = this.props.commonStore.getExchangeRate(props.symbol, props.transaction.purchaseCurrency, props.transaction.purchaseUnitPrice, props.transaction.exchangeRates)
        let salePrice = props.commonStore.getExchangeRate(props.symbol, props.sale.saleCurrency, props.sale.saleUnitPrice, props.sale.exchangeRates)

        return {
            value: props.commonStore.getPercentageChange(salePrice, purchasePrice)
        }
    }

    render() {
        return (
            <Percentage value={this.state.value} />
        )
    }
}
export default SaleProfit;