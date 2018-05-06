import React from 'react';
import { inject, observer } from 'mobx-react';
import Exchange from '../../common/Exchange';
import Percentage from '../../common/Percentage';
import Number from '../../common/Number';

@inject('global', 'coinStore')
@observer
class CoinValues extends React.Component {

    constructor(props) {

        super(props);
        this.getState = this.getState.bind(this);
        this.loadCoin24HrChange = this.loadCoin24HrChange.bind(this);

        this.loadCoin24HrChange(props);
        this.state = this.getState(props);
    }

    componentWillReceiveProps(nextProps) {

        if (!nextProps.coin || nextProps.coin.symbol == this.props.coin.symbol)
            return;

        this.loadCoin24HrChange(nextProps);
        this.setState(this.getState(nextProps));
    }

    getState(props) {
        return {
            coin: props.coin,
            coin24HrChange: ''
        }
    }

    loadCoin24HrChange(props) {

        this.props.coinStore.get24HrPriceChange(props.coin.symbol, this.props.global.selectedCoin)
            .then((change) => {
                this.setState({
                    coin24HrChange: change
                });
            })
    }

    render() {

        return (
            <div className="card">
                <div className="card-body">

                    <div className="row">
                        <div className="col-6 text-left">
                            <h3 className="mb-0">
                                <strong>
                                    <Exchange amount={this.state.coin.priceUsd} from="USD" to={this.props.global.selectedFiat} />
                                </strong>
                                <small className='xs'> {this.props.global.selectedFiat}</small>
                                &nbsp;<Percentage value={this.state.coin.percentChange24h} includeBrackets={true} />
                            </h3>
                        </div>
                        <div className="col-6 text-right">
                            <h3 className="mb-0">
                                <strong>
                                    <Exchange amount={this.state.coin.priceUsd} from="USD" to={this.props.global.selectedCoin} />
                                </strong>
                                <small className='xs'> {this.props.global.selectedCoin}</small>
                                &nbsp;
                                {!(this.props.global.selectedCoin == this.props.coin.symbol) && 
                                    <Percentage value={this.state.coin24HrChange} includeBrackets={true} />
                                }
                            </h3>
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}
export default CoinValues;

