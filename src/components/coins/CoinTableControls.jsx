import React from 'react';
import { inject, observer } from 'mobx-react';
import { DropdownToggle, DropdownMenu, DropdownItem, UncontrolledButtonDropdown, Button } from 'reactstrap';
import Filter from 'react-feather/dist/icons/filter';
import Square from 'react-feather/dist/icons/square';
import CheckSquare from 'react-feather/dist/icons/check-square';

@inject('coinsPageState')
@observer
class CoinTableControls extends React.Component {

    constructor(props) {
        super(props);

        this.nextPage = this.nextPage.bind(this);
        this.previousPage = this.previousPage.bind(this);

        this.toggleShowMyCoinsFirst = this.toggleShowMyCoinsFirst.bind(this);
    }

    nextPage() {
        this.props.coinsPageState.nextPage();
    }

    previousPage() {
        this.props.coinsPageState.previousPage();
    }

    toggleShowMyCoinsFirst() {
        this.props.coinsPageState.toggleShowMyCoinsFirst();
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

                <UncontrolledButtonDropdown size="sm" className="ml-2 icon-dropdown">
                    <DropdownToggle className="btn-outline-secondary">
                        <Filter size={18} />
                    </DropdownToggle>
                    <DropdownMenu right>
                        <DropdownItem onClick={this.toggleShowMyCoinsFirst}>
                            Show my coins first
                            {!this.props.coinsPageState.showMyCoinsFirst &&
                                <Square className="item-icon" size={16} />
                            }
                            {this.props.coinsPageState.showMyCoinsFirst &&
                                <CheckSquare className="item-icon" size={16} />
                            }
                        </DropdownItem>
                    </DropdownMenu>
                </UncontrolledButtonDropdown>
            </div>
        );
    }
}
export default CoinTableControls;