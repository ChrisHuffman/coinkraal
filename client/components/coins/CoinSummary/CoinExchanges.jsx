import React from 'react';
import { inject, observer } from 'mobx-react';
import Exchange from '../../common/Exchange';
import Number from '../../common/Number';
import { Table } from 'reactstrap';

@inject('global', 'coinStore')
@observer
class CoinExchanges extends React.Component {

    constructor(props) {

        super(props);
        this.loadExchanges = this.loadExchanges.bind(this);

        this.state = {
            coin: props.coin,
            exchanges: [],
            toSymbol: ""
        }

        this.loadExchanges(props.coin);
    }

    loadExchanges(coin) {

        var toSymbol = "BTC";
        if (coin.symbol == "BTC")
            toSymbol = "USD";

        this.props.coinStore.getCoinExchanges(coin.symbol, toSymbol, 50)
            .then((exchanges) => {
                this.setState({
                    fromSymbol: toSymbol,
                    exchanges: exchanges ? exchanges : []
                });
            })
    }

    render() {
        var self = this;
        var exchanges = this.state.exchanges;
        var fromSymbol = this.state.fromSymbol;

        return (
            <div>

                <Table responsive>
                    <thead>
                        <tr>
                            <th className="clearTopBorder">Exchange</th>
                            <th className="clearTopBorder">Price</th>
                            <th className="clearTopBorder">Volume (24h)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            exchanges.map(function (exchange) {
                                return <tr key={exchange.MARKET}>
                                    <td>{exchange.MARKET}</td>
                                    <td>
                                        <div>
                                            <Exchange amount={exchange.PRICE} from={fromSymbol} to={self.props.global.selectedFiat} />
                                            <small className='xs'> {self.props.global.selectedFiat}</small>
                                        </div>
                                        <div>
                                            <Exchange amount={exchange.PRICE} from={fromSymbol} to={self.props.global.selectedCoin} />
                                            <small className='xs'> {self.props.global.selectedCoin}</small>
                                        </div>
                                    </td>
                                    <td>
                                        <div>
                                            <Exchange amount={exchange.VOLUME24HOURTO} from={fromSymbol} to={self.props.global.selectedFiat} />
                                            <small className='xs'> {self.props.global.selectedFiat}</small>
                                        </div>
                                        <div>
                                            <Exchange amount={exchange.VOLUME24HOURTO} from={fromSymbol} to={self.props.global.selectedCoin} />
                                            <small className='xs'> {self.props.global.selectedCoin}</small>
                                        </div>
                                    </td>
                                </tr>
                            })
                        }
                    </tbody>
                </Table>



            </div>
        )
    }
}
export default CoinExchanges;

