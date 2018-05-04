import React from 'react';
import { Doughnut } from 'react-chartjs-2';

class DoughnutChart extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            data: this.formatData(props.chart.data),
            options: props.chart.options,
            isLoading: true,
        }
    }

    componentWillReceiveProps(nextProps) {

        if (!nextProps.chart)
             return;

         this.setState({
             data: this.formatData(nextProps.chart.data),
             options: nextProps.chart.options,
        });
    }

    //Remove observables (some reason chart js doesnt like them)
    formatData(data) {

        if (!data || !data.labels)
            return {};

        return {
            labels: data.labels.map(l => l),
            datasets: data.datasets.map(ds => {
                return {
                    data: ds.data.map(d => d),
                    backgroundColor: ds.backgroundColor.map(c => c)
                };
            })
        }
    }

    render() {

        return (

            <div>

                <Doughnut 
                    data={this.state.data}
                    options={this.state.options} />

            </div>
        );
    }
}
export default DoughnutChart;