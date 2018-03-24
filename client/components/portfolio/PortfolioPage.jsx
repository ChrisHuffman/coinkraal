import React from 'react';
import { inject, observer } from 'mobx-react';
import Layout from '../Layout'
import LineChart from '../common/LineChart'
import PortfolioSummary from './PortfolioSummary'
import TransactionSummaryTable from './TransactionSummaryTable'
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

                <div className="row mt-20">
                    <div className="col-md-6">
                        {!this.props.portfolioPageState.isLoadingPorfolioChartData && this.props.portfolioPageState.portfolioChartData &&
                            <LineChart
                                chart={this.props.portfolioPageState.portfolioChartData}
                                onFiltersChanged={this.onFiltersChanged}
                                filters={{
                                    selectedTimeRange: this.props.portfolioPageState.portfolioChartSelectedTimeRange
                                }} />
                        }
                        <div className="row justify-content-center mt-20">
                            <div className="col-auto">
                                <Loader visible={this.props.portfolioPageState.isLoadingPorfolioChartData} />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <PortfolioSummary />
                        <hr />
                        <TransactionSummaryTable />
                    </div>
                </div>

            </Layout>
        );
    }
}
export default PortfolioPage;