import React from 'react';
import axios from 'axios';

class Percentage extends React.Component {

    constructor(props) {
        super(props);

        var colorClass = '';
        if(props.value < 0)
            colorClass = 'text-danger';
        if(props.value > 0)
            colorClass = 'text-success'

        this.state = {
            colorClass: colorClass
        }
    }

    render() {
        return (
            <div className={this.state.colorClass}>
                { this.props.value }%
            </div>
        )
    }
}
export default Percentage;