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
            <div className="row justify-content-around mt-3">
                <div className="col-sm-6 text-center">
                    <h1>
                        {this.props.global.selectedFiat}: <PortfolioValue symbol={this.props.global.selectedFiat} transactions={this.props.transactionStore.transactions} priceIndex={this.props.priceStore.priceIndex} />
                    </h1>
                </div>
                <div className="col-sm-6 text-center">
                    <h1>
                        {this.props.global.selectedCoin}: <PortfolioValue symbol={this.props.global.selectedCoin} transactions={this.props.transactionStore.transactions} priceIndex={this.props.priceStore.priceIndex} />
                    </h1>
                </div>
            </div>
        );
    }
}
export default PortfolioSummary;