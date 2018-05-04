import React from 'react';
import { inject, observer } from 'mobx-react';
import Exchange from '../common/Exchange';

@inject('commonStore')
@observer
class CurrentPrice extends React.Component {

    constructor(props) {
        super(props);
        this.getState = this.getState.bind(this);
        this.state = this.getState(props);
    }

    componentWillReceiveProps(nextProps) {
        this.setState(this.getState(nextProps));
    }

    getState(props) {

        let currentPrice = props.commonStore.getCurrentPrice(props.currentSymbol, props.targetSymbol, props.priceIndex);

        return {
            from: currentPrice.from,
            to: props.currentSymbol,
            amount: currentPrice.amount
        }
    }

    render() {
        return (
            <span>
                
                {!this.state.amount == '' &&
                    <Exchange amount={this.state.amount} from={this.state.from} to={this.state.to} />
                }

                {this.state.amount == '' &&
                    '?'
                }

            </span>
            
        )
    }
}
export default CurrentPrice;