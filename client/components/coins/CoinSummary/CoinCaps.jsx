import React from 'react';
import { inject, observer } from 'mobx-react';
import Exchange from '../../common/Exchange';
import Percentage from '../../common/Percentage';
import Number from '../../common/Number';

@inject('global')
@observer
class CoinCaps extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            coin: props.coin
        }
    }

    render() {

        return (
            <div className="card">
                <div className="card-body">

                    <div className="row small-text">
                        <div className="col-sm-6">
                            <div className="row">
                                <div className="col-12">
                                    <span className="font-weight-bold">Market Cap</span>:&nbsp;
                                    <Exchange amount={this.state.coin.market_cap_usd} from="USD" to={this.props.global.selectedFiat} />
                                    <small className='xs'> {this.props.global.selectedFiat}</small>
                                </div>
                                <div className="col-12 mt-05">
                                    <span className="font-weight-bold">Volume (24h)</span>:&nbsp;
                                    <Exchange amount={this.state.coin["24h_volume_usd"]} from="USD" to={this.props.global.selectedFiat} />
                                    <small className='xs'> {this.props.global.selectedFiat}</small>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-6">
                             <div className="row">
                                <div className="col-12">
                                    <span className="font-weight-bold">Circulating Supply</span>:&nbsp;
                                    <Number amount={this.state.coin.available_supply} />
                                </div>
                                <div className="col-12 mt-05">
                                    <span className="font-weight-bold">Max Supply</span>:&nbsp;
                                    <Number amount={this.state.coin.max_supply ? this.state.coin.max_supply : this.state.coin.total_supply} />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}
export default CoinCaps;

