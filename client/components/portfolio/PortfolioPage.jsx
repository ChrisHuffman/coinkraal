import React from 'react';
import { inject, observer } from 'mobx-react';
import Layout from '../Layout'
import LineChart from '../common/LineChart'
import PortfolioSummary from './PortfolioSummary'
import TransactionSummaryTable from './TransactionSummaryTable'
import Loader from '../common/Loader'

@inject('portfolioPageState', 'transactionStore')
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
                        {(!this.props.portfolioPageState.isLoadingPorfolioChartData && this.props.portfolioPageState.portfolioChartData) &&
                            <LineChart
                                chart={this.props.portfolioPageState.portfolioChartData}
                                onFiltersChanged={this.onFiltersChanged}
                                filters={{
                                    selectedTimeRange: this.props.portfolioPageState.portfolioChartSelectedTimeRange
                                }} />
                        }
                        {(!this.props.transactionStore.isLoading && this.props.transactionStore.transactions.length == 0) &&
                            <div className="row justify-content-center mt-20">
                                <div className="col-auto">
                                    <p>You have no transactions, head over to the transactions tab to add your first one.</p>
                                </div>
                            </div>
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

                       {(!this.props.transactionStore.isLoading && this.props.transactionStore.transactions.length > 0) &&
                            <div>
                                <h4 className="text-primary">
                                    Transaction Summary
                                </h4>
                                <TransactionSummaryTable />
                            </div>
                        }

                    </div>
                </div>

            </Layout>
        );
    }
}
export default PortfolioPage;