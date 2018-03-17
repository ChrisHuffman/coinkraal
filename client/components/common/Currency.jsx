import React from 'react';
import { inject, observer } from 'mobx-react';

class Currency extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            amount: this.formatCurrency(props.amount)
        }
    }

    formatCurrency(amount) {

        var minimumFractionDigits = 2;
        var maximumFractionDigits = 2;

        if(amount < 0.01)
            maximumFractionDigits = 4

        if(amount < 0.0001)
            maximumFractionDigits = 6

        if(amount < 0.000001)
            maximumFractionDigits = 8

        if(amount > 10000) {
            maximumFractionDigits = 0;
            minimumFractionDigits = 0;
        }

        return parseFloat(amount).toLocaleString(undefined, {
            minimumFractionDigits: minimumFractionDigits,
            maximumFractionDigits: maximumFractionDigits
          });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            amount: this.formatCurrency(nextProps.amount)
        });
    }

    render() {
        return (
            <span>
                { this.state.amount }
            </span>
        )
    }
}
export default Currency;