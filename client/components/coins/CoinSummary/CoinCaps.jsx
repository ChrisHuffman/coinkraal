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

                    <div className="row">
                        <div className="col">
                            <span className="font-weight-bold">Rank</span>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col">
                            #<Number amount={this.state.coin.rank} />
                        </div>
                    </div>

                    <div className="row mt-2">
                        <div className="col">
                            <span className="font-weight-bold">Market Cap</span>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col">
                            <Exchange amount={this.state.coin.marketCapUsd} from="USD" to={this.props.global.selectedFiat} />
                            <small className='xs'> {this.props.global.selectedFiat}</small>
                        </div>
                    </div>

                    <div className="row mt-2">
                        <div className="col">
                            <span className="font-weight-bold">Volume (24h)</span>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col">
                            <Exchange amount={this.state.coin.volumeUsd24h} from="USD" to={this.props.global.selectedFiat} />
                            <small className='xs'> {this.props.global.selectedFiat}</small>
                        </div>
                    </div>

                    <div className="row mt-2">
                        <div className="col">
                            <span className="font-weight-bold">Circulating Supply</span>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col">
                            <Number amount={this.state.coin.availableSupply} />
                        </div>
                    </div>

                    <div className="row mt-2">
                        <div className="col">
                            <span className="font-weight-bold">Max Supply</span>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col">
                            <Number amount={this.state.coin.maxSupply ? this.state.coin.maxSupply : this.state.coin.totalSupply} />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col">
                        </div>
                    </div>


                </div>
            </div>
        )
    }
}
export default CoinCaps;

