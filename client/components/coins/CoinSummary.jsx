import React from 'react';
import { inject, observer } from 'mobx-react';
import CoinLogo from '../common/CoinLogo'
import { Button, TabContent, TabPane, Nav, NavItem, NavLink, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import classnames from 'classnames';

@inject('socialStore', 'currencyStore', 'coinsPageState')
@observer
class CoinSummary extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            coin: null,
            activeTab: '1',
            twitterUrl: '',
            redditContent: {
                __html: ""
            }
        }

        this.toggleModal = this.toggleModal.bind(this);
        this.toggleTab = this.toggleTab.bind(this);
        this.setTab = this.setTab.bind(this);
    }

    componentWillReceiveProps(nextProps) {

        if (!nextProps.coin)
            return;

        this.setState({
            coin: nextProps.coin
        });

        var curr = nextProps.currencyStore.getCurrency(nextProps.coin.symbol);

        this.setState({
            twitterUrl: curr.twitterUrl
        });

        if (curr.redditUrl) {
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

    setTab(tab) {
        this.setState({
            activeTab: tab
        });
    }

    toggleModal() {
        this.props.coinsPageState.toggleCoinSummaryModal();
    }

    toggleTab(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            }, this.loadTwitterContent);
        }
    }

    loadTwitterContent() {
        twttr.widgets.load();
    }

    render() {

        return (
            <div>

                <Modal isOpen={this.props.coinsPageState.coinSummaryModal} toggle={this.toggleModal} onOpened={this.setTab.bind(null, '1')} size='lg'>

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
                            <NavItem>
                                <NavLink
                                    className={classnames({ active: this.state.activeTab === '3' })}
                                    onClick={() => { this.toggleTab('3'); }}>
                                    Twitter
                                </NavLink>
                            </NavItem>
                        </Nav>
                        <TabContent activeTab={this.state.activeTab}>
                            <TabPane tabId="1">
                                Summary
                            </TabPane>
                            <TabPane tabId="2">
                                <div className="mb-10" />
                                <div dangerouslySetInnerHTML={this.state.redditContent} />
                            </TabPane>
                            <TabPane tabId="3">
                                <div className="mb-10" />
                                <div className="row justify-content-lg-center">
                                    <div className="col col-lg-9">
                                        <a className="twitter-timeline text-muted" data-dnt="true" data-theme="dark" data-link-color="#007bff" href={this.state.twitterUrl}>loading...</a>
                                    </div>
                                </div>
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

