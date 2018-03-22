import React from 'react';
import { inject, observer } from 'mobx-react';
import Currency from '../common/Currency';

@inject('commonStore')
@observer
class TransactionPrice extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: this.props.commonStore.getTransactionPrice(props.symbol, props.transaction)
        }
    }

    componentWillReceiveProps(nextProps) {

        this.setState({
            value: this.props.commonStore.getTransactionPrice(nextProps.symbol, nextProps.transaction)
        });
    }

    render() {
        return (
            <Currency amount={this.state.value} />
        )
    }
}
export default TransactionPrice;