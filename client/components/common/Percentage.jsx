import React from 'react';

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

        var value = '?';

        if(!isNaN(props.value))
            value = parseFloat(props.value).toFixed(2) + '%';

        var colorClass = '';
        if(props.value < 0)
            colorClass = 'text-danger';
        if(props.value > 0)
            colorClass = 'text-success'

        return {
            value: value,
            colorClass: colorClass,
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