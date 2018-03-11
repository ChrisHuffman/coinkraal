import React from 'react';
import { inject, observer } from 'mobx-react';
import Layout from '../Layout'
import PortfolioChart from './portfolio-chart/PortfolioChart'

@inject('portfolioPageState')
@observer
class PortfolioPage extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        return (

            <Layout>
                <div className="row mt-20">
                    <div className="col-md-7">
                        <PortfolioChart data={this.props.portfolioPageState.portfolioChartData} />
                    </div>
                    <div className="col-md-5">
                    </div>
                </div>
            </Layout>
        );
    }
}
export default PortfolioPage;