import React from 'react';
import { inject, observer } from 'mobx-react';
import { Table } from 'reactstrap';
import Loader from '../common/Loader'
import Percentage from '../common/Percentage'
import CoinLogo from '../common/CoinLogo'
import Exchange from '../common/Exchange'


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
        let self = this;
        let coins = this.props.coinsPageState.coins;

        return (
            <div>
                <Table responsive>
                    <thead>
                        <tr>
                            <th className="clearTopBorder clickable narrow" onClick={self.sort.bind(null, "rank")}>#</th>
                            <th colSpan="2" className="clearTopBorder clickable d-none d-md-table-cell" onClick={self.sort.bind(null, "name")}>Coin</th>
                            <th colSpan="2" className="clearTopBorder clickable d-table-cell d-md-none" onClick={self.sort.bind(null, "name")}>Coin</th>
                            <th className="clearTopBorder text-right clickable d-none d-md-table-cell" onClick={self.sort.bind(null, "marketCapUsd")}>Market Cap ({self.props.global.selectedFiat})</th>
                            <th className="clearTopBorder text-right clickable" onClick={self.sort.bind(null, "priceUsd")}>Price ({self.props.global.selectedFiat})</th>
                            <th className="clearTopBorder text-right clickable d-none d-sm-table-cell">Price ({self.props.global.selectedCoin})</th>
                            <th className="clearTopBorder text-right clickable d-none d-lg-table-cell" onClick={self.sort.bind(null, "volumeUsd24h")}>Volume ({self.props.global.selectedFiat})</th>
                            <th className="clearTopBorder text-right clickable" onClick={self.sort.bind(null, "percentChange24h")}>Change 24h ({self.props.global.selectedFiat})</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            coins.map(function (coin) {

                                let coinRowClass = "clickable";

                                //Highlight my coins
                                if (self.props.coinsPageState.showMyCoinsFirst && self.props.coinsPageState.pageIndex == 0) {
                                    if(self.props.coinsPageState.myCurrencies.indexOf(coin.symbol) != -1)
                                        coinRowClass += " bg-dark";
                                }

                                return <tr key={coin.symbol} onClick={self.coinSummary.bind(null, coin)} className={coinRowClass}>
                                    <td>{coin.rank}</td>
                                    <td><CoinLogo coin={coin.symbol} /></td>
                                    <td className="d-none d-md-table-cell">{coin.name}</td>
                                    <td className="d-table-cell d-md-none">{coin.symbol}</td>
                                    <td className="text-right d-none d-md-table-cell">
                                        {
                                            <Exchange amount={coin.marketCapUsd} from="USD" to={self.props.global.selectedFiat} />
                                        }
                                    </td>
                                    <td className="text-right">
                                        {
                                            <Exchange amount={coin.priceUsd} from="USD" to={self.props.global.selectedFiat} />
                                        }
                                    </td>
                                    <td className="text-right d-none d-sm-table-cell">
                                        {
                                            <Exchange amount={coin.priceUsd} from="USD" to={self.props.global.selectedCoin} />
                                        }
                                    </td>
                                    <td className="text-right d-none d-lg-table-cell">
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

            </div>
        );
    }
}
export default CoinTable;