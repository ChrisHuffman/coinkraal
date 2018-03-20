import React from 'react';
import { inject, observer } from 'mobx-react';
import { Table } from 'reactstrap';
import Loader from '../common/Loader'
import Percentage from '../common/Percentage'
import CoinLogo from '../common/CoinLogo'
import Exchange from '../common/Exchange'
import CoinSummary from './CoinSummary/CoinSummary'

@inject('global', 'coinStore', 'commonStore', 'coinsPageState')
@observer
class CoinTable extends React.Component {

    constructor(props) {

        super(props);

        this.coinSummary = this.coinSummary.bind(this);
        this.sort = this.sort.bind(this);
    }

    coinSummary(coin) {
        this.props.coinsPageState.toggleCoinSummaryModal(coin.symbol);
    }

    sort(column) {
        this.props.coinsPageState.sort(column);
    }

    render() {
        var self = this;
        var coins = this.props.coinsPageState.coins;
        return (
            <div>
                <Table responsive>
                    <thead>
                        <tr>
                            <th className="clearTopBorder clickable narrow" onClick={self.sort.bind(null, "rank")}>#</th>
                            <th className="clearTopBorder clickable narrow" onClick={self.sort.bind(null, "name")}>Coin</th>
                            <th className="clearTopBorder clickable" onClick={self.sort.bind(null, "name")}></th>
                            <th className="clearTopBorder text-right clickable" onClick={self.sort.bind(null, "marketCapUsd")}>Market Cap ({self.props.global.selectedFiat})</th>
                            <th className="clearTopBorder text-right clickable" onClick={self.sort.bind(null, "priceUsd")}>Price ({self.props.global.selectedFiat})</th>
                            <th className="clearTopBorder text-right clickable" onClick={self.sort.bind(null, "priceBtc")}>Price ({self.props.global.selectedCoin})</th>
                            <th className="clearTopBorder text-right clickable" onClick={self.sort.bind(null, "volumeUsd24h")}>Volume ({self.props.global.selectedFiat})</th>
                            <th className="clearTopBorder text-right clickable" onClick={self.sort.bind(null, "percentChange24h")}>Change (24Hr)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            coins.map(function (coin) {
                                return <tr key={coin.symbol} onClick={self.coinSummary.bind(null, coin)} className='clickable'>
                                    <td>{coin.rank}</td>
                                    <td><CoinLogo coin={coin.symbol} /></td>
                                    <td>{coin.name}</td>
                                    <td className="text-right">
                                        {
                                            <Exchange amount={coin.marketCapUsd} from="USD" to={self.props.global.selectedFiat} />
                                        }
                                    </td>
                                    <td className="text-right">
                                        {
                                            <Exchange amount={coin.priceUsd} from="USD" to={self.props.global.selectedFiat} />
                                        }
                                    </td>
                                    <td className="text-right">
                                        {
                                            <Exchange amount={coin.priceBtc} from="BTC" to={self.props.global.selectedCoin} />
                                        }
                                    </td>
                                    <td className="text-right">
                                        {
                                            <Exchange amount={coin.volumeUsd24h} from="USD" to={self.props.global.selectedFiat} />
                                        }
                                    </td>
                                    <td className="text-right">
                                        <Percentage value={coin.percentChange24h} />
                                    </td>
                                </tr>
                            })
                        }
                    </tbody>
                </Table>

                <CoinSummary coinSymbol={this.props.coinsPageState.selectedCoinSymbol} />

            </div>
        );
    }
}
export default CoinTable;