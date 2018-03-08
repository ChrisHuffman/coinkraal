import React from 'react';
import { observe } from 'mobx';
import { inject, observer } from 'mobx-react';
import Loader from '../../common/Loader'
import portfolioChartService from './PortfolioChartService'
import { Line } from 'react-chartjs-2';

@inject('transactionStore')
@observer
class PortfolioChart extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            data: { },
            isLoading: true
        }

        this.loadData = this.loadData.bind(this);

        observe(this.props.transactionStore.transactions, () => {
           this.loadData();
        });
    }

    loadData() {

        this.setState({
            isLoading: true
        });

        portfolioChartService.getData(this.props.transactionStore.transactions)
            .then(data => {
                this.setState({
                    data: data,
                    isLoading: false
                });
            });

    }

    render() {

        return (
            <div>

                <div className="row justify-content-center">
                    <div className="col-auto">
                        <Loader visible={this.state.isLoading} />
                    </div>
                </div>

                {(!this.state.isLoading && this.props.transactionStore.transactions.length == 0) &&
                    <div className="row">
                        <div className="col">
                            No transactions.
                        </div>
                    </div>
                }

                {(!this.state.isLoading && this.props.transactionStore.transactions.length != 0) &&
                    <div className="row">
                        <div className="col">
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
                                                callback: function(value, index, values) {
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
                        </div>
                    </div>
                }


            </div>
        );
    }
}
export default PortfolioChart;