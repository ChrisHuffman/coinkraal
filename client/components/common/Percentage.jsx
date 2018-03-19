import React from 'react';

class Percentage extends React.Component {

    constructor(props) {
        super(props);

        var value = parseFloat(props.value);

        var colorClass = '';
        if(value < 0)
            colorClass = 'text-danger';
        if(value > 0)
            colorClass = 'text-success'

        this.state = {
            colorClass: colorClass
        }
    }

    render() {
        return (
            <span className={this.state.colorClass}>
                { this.props.value }%
            </span>
        )
    }
}
export default Percentage;