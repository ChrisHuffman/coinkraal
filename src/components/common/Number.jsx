import React from 'react';
import { inject, observer } from 'mobx-react';

@inject('utilityService')
class Number extends React.Component {

    constructor(props) {
        super(props);
        this.getState = this.getState.bind(this);
        this.state = this.getState(props);
    }

    componentWillReceiveProps(nextProps) {

        if(nextProps.amount == this.props.amount)
            return;

        this.setState(this.getState(nextProps));
    }

    getState(props) {
        return {
            amount: this.props.utilityService.formatCurrency(props.amount)
        }
    }

    render() {
        return (
            <span>
                { this.state.amount }
            </span>
        )
    }
}
export default Number;