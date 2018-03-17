import React from 'react';
import { inject, observer } from 'mobx-react';
import Currency from '../common/Currency'

@inject('global', 'portfolioPageState')
@observer
class PortfolioSummary extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        return (
            <div>
                <div className="row justify-content-around">
                    <div className="col-sm-6 text-center">
                        <h1>
                            {this.props.global.selectedFiat}
                        </h1>
                    </div>
                    <div className="col-sm-6 text-center">
                        <h1>
                        {this.props.global.selectedCoin}
                        </h1>
                    </div>
                </div>

                <div className="row justify-content-around">
                    <div className="col-sm-6 text-center">
                        <h3>
                            <Currency amount={this.props.portfolioPageState.latestFiatValue} />
                        </h3>
                    </div>
                    <div className="col-sm-6 text-center">
                        <h3>
                            <Currency amount={this.props.portfolioPageState.latestCoinValue} />
                        </h3>
                    </div>
                </div>
            </div>
        );
    }
}
export default PortfolioSummary;