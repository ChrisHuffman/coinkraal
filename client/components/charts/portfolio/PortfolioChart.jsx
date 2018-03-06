import React from 'react';
import { observe, autorun } from 'mobx';
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
            data: {},
            hasData: false
        }

        this.loadData = this.loadData.bind(this);

        observe(this.props.transactionStore.transactions, () => {
            this.loadData();
        });
    }

    loadData() {

        portfolioChartService.getData(this.props.transactionStore.transactions)
            .then(data => {
                this.setState({
                    data: data,
                    hasData: true
                });
            });

    }

    render() {

        return (
            <div>

                <div className="row justify-content-center">
                    <div className="col-auto">
                        <Loader visible={!this.state.hasData} />
                    </div>
                </div>

                {this.state.hasData &&
                    <div className="row">
                        <div className="col">
                            <Line 
                                data={this.state.data}
                                options={{
                                    responsive: true,
					                hoverMode: 'index',
					                stacked: false,
                                    scales: {
                                        yAxes: [{
                                            type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                                            display: true,
                                            position: 'left',
                                            id: 'y-axis-1',
                                        }, {
                                            type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                                            display: true,
                                            position: 'right',
                                            id: 'y-axis-2',
                
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