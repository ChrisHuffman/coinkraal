import React from 'react';
import { inject } from 'mobx-react';

@inject('utilityService')
class Percentage extends React.Component {

    constructor(props) {
        super(props);
        this.getState = this.getState.bind(this);
        this.state = this.getState(props);
    }

    componentWillReceiveProps(nextProps) {
        this.setState(this.getState(nextProps));
    }

    getState(props) {

        let value = '?';

        if(!this.props.utilityService.isNaN(props.value)) {
            
            let minimumFractionDigits = 2;
            let maximumFractionDigits = 2;

            if(props.value >= 10 || props.value <= -10 || props.value % 1 == 0) {
                maximumFractionDigits = 0;
                minimumFractionDigits = 0;
            }

            value = parseFloat(props.value).toLocaleString(undefined, {
                minimumFractionDigits: minimumFractionDigits,
                maximumFractionDigits: maximumFractionDigits
            }) + '%';
        }

        let colorClass = '';
        if(props.value < 0)
            colorClass = 'text-danger';
        if(props.value > 0)
            colorClass = 'text-success'

        if(props.includeBrackets)
            value = `(${value})`;

        return {
            value: value,
            colorClass: colorClass
        }
    }

    render() {
        return (
            <span className={this.state.colorClass}>
                { this.state.value }
            </span>
        )
    }
}
export default Percentage;