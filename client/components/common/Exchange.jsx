import React from 'react';
import { inject, observer } from 'mobx-react';
import Currency from './Currency'

@inject('exchangeStore')
@observer
class Exchange extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            amount: props.exchangeStore.exchange(props.amount, props.from, props.to)
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            amount: nextProps.exchangeStore.exchange(nextProps.amount, nextProps.from, nextProps.to)
        });
    }

    render() {
        return (
            <Currency amount={this.state.amount} />
        )
    }
}
export default Exchange;