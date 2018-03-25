import React from 'react';
import { inject, observer } from 'mobx-react';
import Currency from '../common/Currency'
import PortfolioValue from './PortfolioValue'

@inject('global', 'transactionStore', 'priceStore')
@observer
class PortfolioSummary extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        return (
            <div>
                <div className="row justify-content-around">
                    <div className="col-6 text-center">
                        <h1>
                            {this.props.global.selectedFiat}
                        </h1>
                    </div>
                    <div className="col-6 text-center">
                        <h1>
                        {this.props.global.selectedCoin}
                        </h1>
                    </div>
                </div>

                <div className="row justify-content-around">
                    <div className="col-6 text-center">
                        <h3>
                            <PortfolioValue symbol={this.props.global.selectedFiat} transactions={this.props.transactionStore.transactions} priceIndex={this.props.priceStore.priceIndex} />
                        </h3>
                    </div>
                    <div className="col-6 text-center">
                        <h3>
                            <PortfolioValue symbol={this.props.global.selectedCoin} transactions={this.props.transactionStore.transactions} priceIndex={this.props.priceStore.priceIndex} />
                        </h3>
                    </div>
                </div>
            </div>
        );
    }
}
export default PortfolioSummary;