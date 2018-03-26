import React from 'react';
import { inject, observer } from 'mobx-react';
import CoinLogo from '../../common/CoinLogo'
import TwitterFeed from './TwitterFeed'
import RedditFeed from './RedditFeed'
import CoinSummary from './CoinSummary'
import { Button, TabContent, TabPane, Nav, NavItem, NavLink, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import classnames from 'classnames';

@inject('socialStore', 'coinStore', 'coinsPageState')
@observer
class CoinSummaryModal extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            coin: null,
            links: [],
            activeTab: '1',
            twitterUrl: '',
            redditUrl: ''
        }

        this.toggleModal = this.toggleModal.bind(this);
        this.toggleTab = this.toggleTab.bind(this);
        this.setTab = this.setTab.bind(this);
    }

    getUrl(name, links) {
        var link = links.find((l) => {
            return l.name == name;
        })
        return link ? link.url : '';
    }

    componentWillReceiveProps(nextProps) {

        if (!nextProps.coinSymbol || nextProps.coinSymbol == this.props.coinSymbol)
            return;

        this.props.coinsPageState.loadCoinChartData();

        var coin =  this.props.coinStore.getCoin(nextProps.coinSymbol);

        this.props.coinStore.getCoinLinks(nextProps.coinSymbol)
            .then((links) => {
                this.setState({
                    links: links,
                    twitterUrl: this.getUrl('twitter', links),
                    redditUrl: this.getUrl('reddit', links)
                });
            })
        
        this.setState({
            coin: coin,
        });
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
            });
        }
    }

    render() {

        return (
            <div>

                <Modal isOpen={this.props.coinsPageState.coinSummaryModal} toggle={this.toggleModal} onOpened={this.setTab.bind(null, '1')} size='xl'>

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
                                <div className="mb-10" />
                                <CoinSummary coin={this.state.coin} links={this.state.links} />
                            </TabPane>
                            <TabPane tabId="2">
                                <div className="mb-10" />
                                <RedditFeed redditUrl={this.state.redditUrl} />
                            </TabPane>
                            <TabPane tabId="3">
                                <div className="mb-10" />
                                <TwitterFeed twitterUrl={this.state.twitterUrl} />
                            </TabPane>
                        </TabContent>
                    </ModalBody>

                    <ModalFooter>
                        <Button outline color="secondary" onClick={this.toggleModal}>Close</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}
export default CoinSummaryModal;

