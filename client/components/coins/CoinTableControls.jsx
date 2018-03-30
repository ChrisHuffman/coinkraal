import React from 'react';
import { inject, observer } from 'mobx-react';
import { Button } from 'reactstrap';

@inject('coinsPageState')
@observer
class CoinTableControls extends React.Component {

    constructor(props) {
        super(props);

        this.nextPage = this.nextPage.bind(this);
        this.previousPage = this.previousPage.bind(this);
    }

    nextPage() {
        this.props.coinsPageState.nextPage();
    }

    previousPage() {
        this.props.coinsPageState.previousPage();
    }

    render() {
        return (
            <div>
                {!this.props.coinsPageState.isFirstPage &&
                    <Button outline color="secondary" className="mr-10" size="sm" onClick={this.previousPage}>&#x3C; Previous 100</Button>
                }

                {!this.props.coinsPageState.isLastPage &&
                    <Button outline color="secondary" size="sm" onClick={this.nextPage}>Next 100 &#x3E;</Button>
                }
            </div>
        );
    }
}
export default CoinTableControls;