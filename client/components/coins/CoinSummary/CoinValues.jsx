import React from 'react';
import { inject, observer } from 'mobx-react';
import Exchange from '../../common/Exchange';
import Percentage from '../../common/Percentage';
import Number from '../../common/Number';

@inject('global')
@observer
class CoinValues extends React.Component {

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
                        <div className="col-6 text-left">
                            <h3>
                                <Exchange amount={this.state.coin.priceUsd} from="USD" to={this.props.global.selectedFiat} />
                                <small className='xs'> {this.props.global.selectedFiat}</small>
                            </h3>
                        </div>
                        <div className="col-6 text-right">
                            <h3>
                                <Percentage value={this.state.coin.percentChange24h} />
                            </h3>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-6 text-left">
                            <h6 className="text-muted">
                                <Exchange amount={this.state.coin.priceBtc} from="BTC" to={this.props.global.selectedCoin} />
                                <small className='xs'> {this.props.global.selectedCoin}</small>
                            </h6>
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}
export default CoinValues;

