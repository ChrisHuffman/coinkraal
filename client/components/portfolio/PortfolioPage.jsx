import React from 'react';
import { inject, observer } from 'mobx-react';
import Layout from '../Layout'
import LineChart from '../common/LineChart'
import DoughnutChart from '../common/DoughnutChart'
import PortfolioSummary from './PortfolioSummary'
import TransactionSummaryTable from './TransactionSummaryTable'
import TransactionSummaryTableControls from './TransactionSummaryTableControls'
import Loader from '../common/Loader'
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';

@inject('portfolioPageState', 'transactionStore')
@observer
class PortfolioPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            activeTab: '1'
        }

        this.setTab = this.setTab.bind(this);
        this.onFiltersChanged = this.onFiltersChanged.bind(this);
    }

    setTab(tab) {
        this.setState({
            activeTab: tab
        });
    }

    toggleTab(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    onFiltersChanged(filters) {
        this.props.portfolioPageState.portfolioChartSetFilters(filters);
    }

    render() {

        return (

            <Layout>

                <PortfolioSummary />

                <hr />

                {(!this.props.transactionStore.isLoading && this.props.transactionStore.transactions.length > 0) &&
                    <div className="row">

                        <div className="col-lg-6">
                            <div className="row">
                                <div className="col-10">
                                    <h4 className="text-primary">
                                        Transaction Summary
                                    </h4>
                                </div>
                                <div className="col-2 text-right">
                                    <TransactionSummaryTableControls />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col">
                                    <TransactionSummaryTable />
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-6">

                            <Nav tabs>
                                <NavItem>
                                    <NavLink
                                        className={classnames({ active: this.state.activeTab === '1' })}
                                        onClick={() => { this.toggleTab('1'); }}>
                                        Historical Value
                                </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        className={classnames({ active: this.state.activeTab === '2' })}
                                        onClick={() => { this.toggleTab('2'); }}>
                                        Risk
                                </NavLink>
                                </NavItem>
                            </Nav>

                            <TabContent activeTab={this.state.activeTab}>
                                <TabPane tabId="1">
                                    <div className="mb-10" />
                                    {(!this.props.portfolioPageState.isLoadingPorfolioChartData && this.props.portfolioPageState.portfolioChartData) &&
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
                                </TabPane>
                                <TabPane tabId="2">
                                    <div className="mb-10" />
                                    <DoughnutChart
                                        chart={this.props.portfolioPageState.coinRiskChartData} />
                                </TabPane>
                            </TabContent>

                        </div>

                    </div>
                }

                {(!this.props.transactionStore.isLoading && this.props.transactionStore.transactions.length == 0) &&
                    <div className="row">
                        <div className="col text-center">
                            <p>You have no transactions, head over to the transactions tab to add your first one.</p>
                        </div>
                    </div>
                }

            </Layout>
        );
    }
}
export default PortfolioPage;