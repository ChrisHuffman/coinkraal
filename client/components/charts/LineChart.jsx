import React from 'react';
import { inject, observer } from 'mobx-react';
import { Line } from 'react-chartjs-2';

class LineChart extends React.Component {

    constructor() {
        super();
    }

    render() {

        return (
            <div>
                <Line data={this.props.data} />
            </div>
        );
    }
}

export default LineChart;