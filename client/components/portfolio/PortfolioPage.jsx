import React from 'react';
import { inject, observer } from 'mobx-react';
import Layout from '../Layout'
import PortfolioChart from './PortfolioChart'
import PortfolioSummary from './PortfolioSummary'
import Loader from '../common/Loader'

@inject('portfolioPageState')
@observer
class PortfolioPage extends React.Component {

    constructor(props) {
        super(props);

        this.onFiltersChanged = this.onFiltersChanged.bind(this);
    }

    onFiltersChanged(filters) {
        this.props.portfolioPageState.portfolioChartSetFilters(filters);
    }

    render() {

        return (

            <Layout>

                {!this.props.portfolioPageState.isLoadingPorfolioChartData &&
                    <div className="row mt-20">
                        <div className="col-md-7">
                            <PortfolioChart
                                chart={this.props.portfolioPageState.portfolioChartData}
                                onFiltersChanged={this.onFiltersChanged}
                                filters={{
                                    selectedFiat: this.props.portfolioPageState.portfolioChartSelectedFiat,
                                    selectedCoin: this.props.portfolioPageState.portfolioChartSelectedCoin,
                                    selectedTimeRange: this.props.portfolioPageState.portfolioChartSelectedTimeRange
                                }} />
                        </div>
                        <div className="col-md-5">
                            <PortfolioSummary />
                            <hr />
                        </div>
                    </div>
                }

                <div className="row justify-content-center mt-20">
                    <div className="col-auto">
                        <Loader visible={this.props.portfolioPageState.isLoadingPorfolioChartData} />
                    </div>
                </div>
            </Layout>
        );
    }
}
export default PortfolioPage;