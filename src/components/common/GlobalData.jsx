import React from 'react';
import { inject, observer } from 'mobx-react';
import Exchange from './Exchange';

@inject('global')
@observer
class GlobalData extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="text-secondary">
                <span>
                    <strong>Market Cap: </strong>
                    <Exchange amount={this.props.global.marketCap} from="USD" to={this.props.global.selectedFiat} />
                    <small className='xs'> {this.props.global.selectedFiat}</small>
                </span>
                <br/>
                <span>
                    <strong>BTC Dominance: </strong>
                     {this.props.global.btcDominace}%
                </span>
            </div>
        )
    }
}
export default GlobalData;