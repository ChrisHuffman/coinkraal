import React from 'react';
import { inject, observer } from 'mobx-react';
import Currency from '../common/Currency';

@inject('commonStore')
@observer
class SalePrice extends React.Component {

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
            value: this.props.commonStore.getExchangeRate(props.symbol, props.sale.saleCurrency, props.sale.saleUnitPrice, props.sale.exchangeRates)
        }
    }

    render() {
        return (
            <Currency amount={this.state.value} />
        )
    }
}
export default SalePrice;