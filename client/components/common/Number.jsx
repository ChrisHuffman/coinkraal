import React from 'react';
import { inject, observer } from 'mobx-react';
import CommonService from '../../services/CommonService'

class Number extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            amount: CommonService.formatCurrency(props.amount)
        }
    }

    componentWillReceiveProps(nextProps) {
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
export default Number;