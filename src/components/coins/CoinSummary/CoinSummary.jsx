import React from 'react';
import { inject, observer } from 'mobx-react';
import LineChart from '../../common/LineChart'
import CoinValues from './CoinValues'
import CoinCaps from './CoinCaps'
import CoinSocial from './CoinSocial'

@inject('coinsPageState')
@observer
class CoinSummary extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            coin: props.coin,
            links: props.links
        }

        this.onFiltersChanged = this.onFiltersChanged.bind(this);
    }

    componentWillReceiveProps(nextProps) {

        this.setState({
            coin: nextProps.coin,
            links: nextProps.links
        });
    }

    onFiltersChanged(filters) {
        this.props.coinsPageState.coinChartSetFilters(filters);
    }

    render() {

        return (
            <div>

                <div className="row">
                    <div className="col">
                        <CoinValues coin={this.state.coin} />
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm-9 pt-2">

                        {!this.props.coinsPageState.isLoadingCoinChartData &&
                            <LineChart
                                chart={this.props.coinsPageState.coinChartData}
                                onFiltersChanged={this.onFiltersChanged}
                                filters={{
                                    selectedTimeRange: this.props.coinsPageState.coinChartSelectedTimeRange
                                }} />
                        }

                    </div>

                    <div className="col-sm-3 pt-2 pl-sm-0">
                        <CoinCaps coin={this.state.coin} />
                        <div className="mt-1" />
                        <CoinSocial links={this.state.links} />
                    </div>

                </div>
                
            </div>
        )
    }
}
export default CoinSummary;

