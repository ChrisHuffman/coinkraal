import React from 'react';
import { inject, observer } from 'mobx-react';
import { Table } from 'reactstrap';
import Loader from '../common/Loader'
import Percentage from '../common/Percentage'

@inject('coinStore', 'commonStore')
@observer
class CoinTable extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            coins: [],
            isLoading: false,
            start: 0,
            limit: 100
        }

        this.loadCoins = this.loadCoins.bind(this);
    }

    componentDidMount() {
        this.loadCoins();
    }

    loadCoins() {

        this.setState({
            isLoading: true
        });

        this.props.coinStore.getCoins(this.state.start, this.state.limit)
            .then(coins => {
                this.setState({
                    coins: coins,
                    isLoading: false
                });
            });
    }

    render() {
        var self = this;
        var coins = this.state.coins;
        return (
            <div>

                <div className="row justify-content-center mt-20">
                    <div className="col-auto">
                        <Loader visible={this.state.isLoading} />
                    </div>
                </div>

                {!this.state.isLoading &&
                    <div className="row mt-10">
                        <div className="col-md">
                            <Table responsive size="sm">
                                <thead>
                                    <tr>
                                        <th className="clearTopBorder">#</th>
                                        <th className="clearTopBorder">Coin</th>
                                        <th className="clearTopBorder text-right">Market Cap</th>
                                        <th className="clearTopBorder text-right">Price</th>
                                        <th className="clearTopBorder text-right">Change (24Hr)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        coins.map(function (coin) {
                                            return <tr key={coin.id}>
                                                <td>{coin.rank}</td>
                                                <td>{coin.name}</td>
                                                <td className="text-right">{self.props.commonStore.formatUSD(coin.market_cap_usd)}</td>
                                                <td className="text-right">{self.props.commonStore.formatUSD(coin.price_usd)}</td>
                                                <td className="text-right">
                                                    <Percentage value={coin.percent_change_24h}/>
                                                </td>
                                            </tr>
                                        })
                                    }
                                </tbody>
                            </Table>
                        </div>
                    </div>
                }

            </div>
        );
    }
}
export default CoinTable;