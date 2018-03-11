import React from 'react';
import { Line } from 'react-chartjs-2';

class PortfolioChart extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            data:this.formatData(props.data),
            isLoading: true
        }
    }

    formatData(data) {

        if(!data.labels)
            return { };

        return {
            labels: data.labels.map(l => l),
            datasets: data.datasets.map(ds => {
                return {
                    borderColor: ds.borderColor,
                    borderWidth: ds.borderWidth,
                    data: ds.data.map(d => d),
                    fill: ds.fill,
                    label: ds.label,
                    lineTension: ds.lineTension,
                    pointRadius: ds.pointRadius,
                    pointStyle: ds.pointStyle,
                    yAxisID: ds.yAxisID
                };
            })
        }

    }

    componentWillReceiveProps(nextProps) {

        if (!nextProps.data)
            return;

        this.setState({
            data: this.formatData(nextProps.data)
        });
    }

    render() {

        return (

            <Line
            data={this.state.data}
            options={{
                responsive: true,
                hoverMode: 'index',
                stacked: false,
                legend: {
                    labels: {
                        usePointStyle: true
                    }
                },
                tooltips: {
                    position: 'nearest',
                    mode: 'index',
                    intersect: false,
                    cornerRadius: 2
                },
                scales: {
                    xAxes: [{
                        type: 'time',
                        time: {
                            unit: 'month'
                        }
                    }],
                    yAxes: [{
                        type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                        display: true,
                        position: 'left',
                        id: 'y-axis-1',
                        ticks: {
                            // Include a dollar sign in the ticks
                            callback: function (value, index, values) {
                                return '$' + value;
                            }
                        }
                        // type: 'logarithmic',
                    }, {
                        type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                        display: true,
                        position: 'right',
                        id: 'y-axis-2',
                        //type: 'logarithmic',

                        // grid line settings
                        gridLines: {
                            drawOnChartArea: false, // only want the grid lines for one axis to show up
                        },
                    }],
                }
            }} />

            // <Layout>


            //     <div className="row justify-content-center">
            //         <div className="col-auto">
            //             <Loader visible={this.state.isLoading} />
            //         </div>
            //     </div>

            //     {(!this.state.isLoading && this.props.transactionStore.transactions.length == 0) &&
            //         <div className="row">
            //             <div className="col">
            //                 No transactions.
            //             </div>
            //         </div>
            //     }

            //     {(!this.state.isLoading && this.props.transactionStore.transactions.length != 0) &&
            //         <div className="row">
            //             <div className="col">
            //                 <Line
            //                     data={this.state.data}
            //                     options={{
            //                         responsive: true,
            // 		                hoverMode: 'index',
            //                         stacked: false,
            //                         legend: {
            //                             labels: {
            //                                 usePointStyle: true
            //                             }
            //                         },
            //                         tooltips: {
            //                             position: 'nearest',
            //                             mode: 'index',
            //                             intersect: false,
            //                             cornerRadius: 2
            //                         },
            //                         scales: {
            //                             xAxes: [{
            //                                 type: 'time',
            //                                 time: {
            //                                     unit: 'month'
            //                                 }
            //                             }],
            //                             yAxes: [{
            //                                 type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
            //                                 display: true,
            //                                 position: 'left',
            //                                 id: 'y-axis-1',
            //                                 ticks: {
            //                                     // Include a dollar sign in the ticks
            //                                     callback: function(value, index, values) {
            //                                         return '$' + value;
            //                                     }
            //                                 }
            //                                // type: 'logarithmic',
            //                             }, {
            //                                 type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
            //                                 display: true,
            //                                 position: 'right',
            //                                 id: 'y-axis-2',
            //                                 //type: 'logarithmic',

            //                                 // grid line settings
            //                                 gridLines: {
            //                                     drawOnChartArea: false, // only want the grid lines for one axis to show up
            //                                 },
            //                             }],
            //                         }
            //                     }} />
            //             </div>
            //         </div>
            //     }


            // </Layout>
        );
    }
}
export default PortfolioChart;