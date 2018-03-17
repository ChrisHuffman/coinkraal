import React from 'react';
import { inject, observer } from 'mobx-react';

@inject('exchangeStore')
@observer
class Exchange extends React.Component {

    constructor(props) {
        super(props);

        var amount = props.exchangeStore.exchange(props.amount, props.from, props.to);
        this.state = {
            amount: this.formatCurrency(amount)
        }
    }

    formatCurrency(amount) {

        var minimumFractionDigits = 2;
        var maximumFractionDigits = 2;

        if(amount < 0.01)
            maximumFractionDigits = 6

        if(amount > 1000000) {
            maximumFractionDigits = 0;
            minimumFractionDigits = 0;
        }

        return parseFloat(amount).toLocaleString(undefined, {
            minimumFractionDigits: minimumFractionDigits,
            maximumFractionDigits: maximumFractionDigits
          });
    }

    componentWillReceiveProps(nextProps) {
        var amount = nextProps.exchangeStore.exchange(nextProps.amount, nextProps.from, nextProps.to);
        this.setState({
            amount: this.formatCurrency(amount)
        });
    }

    render() {
        return (
            <div>
                { this.state.amount }
            </div>
        )
    }
}
export default Exchange;