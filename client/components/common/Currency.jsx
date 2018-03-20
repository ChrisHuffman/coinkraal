import React from 'react';
import { inject, observer } from 'mobx-react';
import CommonService from '../../services/CommonService'

class Currency extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            amount: CommonService.formatCurrency(props.amount)
        }
    }

    componentWillReceiveProps(nextProps) {

        if(nextProps.amount == this.props.amount)
            return;

        this.setState({
            amount: CommonService.formatCurrency(nextProps.amount)
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