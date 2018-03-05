import React from 'react';
import { observe, autorun } from 'mobx';
import { inject, observer } from 'mobx-react';
import Loader from '../common/Loader'
import { Line } from 'react-chartjs-2';

@inject('transactionStore', 'portfolioChartStore')
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

        this.props.portfolioChartStore.getData(this.props.transactionStore.transactions)
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
                            <Line data={this.state.data} />
                        </div>
                    </div>
                }


            </div>
        );
    }
}
export default PortfolioChart;