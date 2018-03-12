import React from 'react';
import { inject, observer } from 'mobx-react';
import CoinLogo from '../common/CoinLogo'
import moment from 'moment';
import { Button, TabContent, TabPane, Nav, NavItem, NavLink, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import classnames from 'classnames';


@inject('coinStore', 'commonStore', 'socialStore', 'currencyStore')
@observer
class CoinSummary extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            coin: null,
            activeTab: '1',
            redditContent: {
                __html: ""
            }
        }

        this.toggleModal = this.toggleModal.bind(this);
        this.toggleTab = this.toggleTab.bind(this);
    }

    componentWillReceiveProps(nextProps) {

        if (!nextProps.coin)
            return;

        this.setState({
            coin: nextProps.coin
        });

        var curr = nextProps.currencyStore.getCurrency(nextProps.coin.symbol);

        if(curr.redditUrl)
        {
            //Load reddit content
            this.props.socialStore.getRedditContent(curr.redditUrl)
                .then(content => {
                    this.setState({
                        redditContent: {
                            __html: content
                        }
                    });
                });
        }
        else {
            this.setState({
                redditContent: {
                    __html: 'No reddit feed.'
                }
            });
        }
    }

    toggleModal() {
        this.props.coinStore.toggleCoinSummaryModal();
    }

    toggleTab(tab) {
        if (this.state.activeTab !== tab) {
          this.setState({
            activeTab: tab
          });
        }
      }

    render() {

        return (
            <div>

                <Modal isOpen={this.props.coinStore.coinSummaryModal} toggle={this.toggleModal} size='lg'>

                    <div className="modal-header">
                        <CoinLogo coin={this.state.coin ? this.state.coin.symbol : ""} />
                        <h5 className="modal-title ml-10">{this.state.coin ? this.state.coin.name : ""}</h5>
                        <button type="button" className="close" aria-label="Close" onClick={this.toggleModal}><span aria-hidden="true">&times;</span></button>
                    </div>

                    <ModalBody>
                        <Nav tabs>
                            <NavItem>
                                <NavLink
                                    className={classnames({ active: this.state.activeTab === '1' })}
                                    onClick={() => { this.toggleTab('1'); }}>
                                    Summary
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    className={classnames({ active: this.state.activeTab === '2' })}
                                    onClick={() => { this.toggleTab('2'); }}>
                                    Reddit
                                </NavLink>
                            </NavItem>
                        </Nav>
                        <TabContent activeTab={this.state.activeTab}>
                            <TabPane tabId="1">
                                Summary
                            </TabPane>
                            <TabPane tabId="2">
                                <div id='reddit'></div>
                                <div dangerouslySetInnerHTML={this.state.redditContent} />
                            </TabPane>
                        </TabContent>
                    </ModalBody>

                    <ModalFooter>
                        <Button outline color="light" onClick={this.toggleModal}>Close</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}
export default CoinSummary;
