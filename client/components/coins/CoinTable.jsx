import React from 'react';
import { inject, observer } from 'mobx-react';
import { Table } from 'reactstrap';
import Loader from '../common/Loader'
import Percentage from '../common/Percentage'
import CoinLogo from '../common/CoinLogo'
import CoinSummary from './CoinSummary'

@inject('coinStore', 'commonStore', 'coinsPageState')
@observer
class CoinTable extends React.Component {

    constructor(props) {

        super(props);

        this.coinSummary = this.coinSummary.bind(this);
        this.sort = this.sort.bind(this);
    }

    coinSummary(coin, event) {
        this.props.coinsPageState.toggleCoinSummaryModal(coin);
    }

    sort(column) {
        this.props.coinsPageState.sort(column);
    }

    render() {
        var self = this;
        var isLoading = this.props.coinsPageState.isLoading;
        var coins = this.props.coinsPageState.coins;
        return (
            <div>

                {!isLoading &&
                    <Table responsive>
                        <thead>
                            <tr>
                                <th className="clearTopBorder clickable narrow" onClick={this.sort.bind(null, "rank")}>#</th>
                                <th className="clearTopBorder clickable narrow" onClick={this.sort.bind(null, "name")}>Coin</th>
                                <th className="clearTopBorder clickable" onClick={this.sort.bind(null, "name")}></th>
                                <th className="clearTopBorder text-right clickable" onClick={this.sort.bind(null, "market_cap_usd")}>Market Cap</th>
                                <th className="clearTopBorder text-right clickable" onClick={this.sort.bind(null, "price_usd")}>Price</th>
                                <th className="clearTopBorder text-right clickable" onClick={this.sort.bind(null, "24h_volume_usd")}>Volume</th>
                                <th className="clearTopBorder text-right clickable" onClick={this.sort.bind(null, "percent_change_24h")}>Change (24Hr)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                coins.map(function (coin) {
                                    return <tr key={coin.id} onClick={self.coinSummary.bind(event, coin)} className='clickable'>
                                        <td>{coin.rank}</td>
                                        <td><CoinLogo coin={coin.symbol} /></td>
                                        <td>{coin.name}</td>
                                        <td className="text-right">{self.props.commonStore.formatUSD(coin.market_cap_usd)}</td>
                                        <td className="text-right">{self.props.commonStore.formatUSD(coin.price_usd)}</td>
                                        <td className="text-right">{self.props.commonStore.formatUSD(coin["24h_volume_usd"])}</td>
                                        <td className="text-right">
                                            <Percentage value={coin.percent_change_24h} />
                                        </td>
                                    </tr>
                                })
                            }
                        </tbody>
                    </Table>
                }

                <CoinSummary coin={this.props.coinsPageState.selectedCoin} />

                <div className="row justify-content-center mt-20">
                    <div className="col-auto">
                        <Loader visible={isLoading} />
                    </div>
                </div>

            </div>
        );
    }
}
export default CoinTable;