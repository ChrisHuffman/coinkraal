import React from 'react';
import { inject, observer } from 'mobx-react';
import { DropdownToggle, DropdownMenu, DropdownItem, ButtonDropdown, Button } from 'reactstrap';
import Filter from 'react-feather/dist/icons/filter';

@inject('portfolioPageState')
@observer
class TransactionSummaryTableControls extends React.Component {

    constructor(props) {
        super(props);

        this.nextPage = this.nextPage.bind(this);
        this.previousPage = this.previousPage.bind(this);
    }

    nextPage() {
        this.props.portfolioPageState.nextPage();
    }

    previousPage() {
        this.props.portfolioPageState.previousPage();
    }

    render() {
        return (
            <div>
                {!this.props.portfolioPageState.isFirstPage &&
                    <Button outline color="secondary" className="ml-2" size="sm" onClick={this.previousPage}>&#x3C;</Button>
                }
                {!this.props.portfolioPageState.isLastPage &&
                    <Button outline color="secondary" size="sm" className="ml-2" onClick={this.nextPage}>&#x3E;</Button>
                }
            </div>
        );
    }
}
export default TransactionSummaryTableControls;
