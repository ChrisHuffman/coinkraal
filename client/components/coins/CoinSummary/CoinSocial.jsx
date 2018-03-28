import React from 'react';
import { inject, observer } from 'mobx-react';
import Exchange from '../../common/Exchange';
import Percentage from '../../common/Percentage';
import Number from '../../common/Number';
import Layout from 'react-feather/dist/icons/layout';
import Github from 'react-feather/dist/icons/github';
import Twitter from 'react-feather/dist/icons/twitter';
import Send from 'react-feather/dist/icons/send';
import Search from 'react-feather/dist/icons/search';
import { UncontrolledTooltip } from 'reactstrap';

@inject('global')
@observer
class CoinSocial extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            links: props.links
        }

        this.openLink = this.openLink.bind(this);
        this.getUrl = this.getUrl.bind(this);
    }

    componentWillReceiveProps(nextProps) {

        this.setState({
            links: nextProps.links
        });
    }

    openLink(name) {
        window.open(this.getUrl(name));
    }

    getUrl(name, links) {
        var link = this.state.links.find((l) => {
            return l.name == name;
        })
        return link ? link.url : '';
    }

    render() {

        return (
            <div className="card">
                <div className="card-body">

                    <div className="row">
                    
                    { this.getUrl('website') &&
                        <div className="col-auto">
                            <Layout className="clickable" id="websiteLink" size={20} onClick={this.openLink.bind(null, 'website')} />
                            <UncontrolledTooltip target="websiteLink" delay={{ show: 600 }}>Website</UncontrolledTooltip>
                        </div>
                    }

                    { this.getUrl('explorer') &&
                        <div className="col-auto">
                            <Search className="clickable" id="explorer" size={20} onClick={this.openLink.bind(null, 'explorer')} />
                            <UncontrolledTooltip target="explorer" delay={{ show: 600 }}>Explorer</UncontrolledTooltip>
                        </div>
                    }

                    { this.getUrl('sourceCode') &&
                        <div className="col-auto">
                            <Github className="clickable" id="sourceCodeLink" size={20} onClick={this.openLink.bind(null, 'sourceCode')} />
                            <UncontrolledTooltip target="sourceCodeLink" delay={{ show: 600 }}>Source Code</UncontrolledTooltip>
                        </div>
                    }

                    { this.getUrl('twitter') &&
                        <div className="col-auto">
                            <Twitter className="clickable" id="twitter" size={20} onClick={this.openLink.bind(null, 'twitter')} />
                        </div>
                    }

                    { this.getUrl('telegram') &&
                        <div className="col-auto">
                            <Send className="clickable" id="telegram" size={20} onClick={this.openLink.bind(null, 'telegram')} />
                        </div>
                    }


                    </div>




                    {/* <span className="clickable" onClick={this.openUrl.bind(null, 'hi')}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="20" height="20" fill="currentcolor" fillRule="evenodd" clipRule="evenodd" strokeLinejoin="round" strokeMiterlimit="1.414">
                            <title id="simpleicons-telegram-icon">Telegram</title>
                            <path d="M9.028 20.837c-.714 0-.593-.271-.839-.949l-2.103-6.92L22.263 3.37" />
                            <path d="M9.028 20.837c.552 0 .795-.252 1.105-.553l2.941-2.857-3.671-2.214" />
                            <path d="M9.403 15.213l8.89 6.568c1.015.56 1.748.271 2-.942l3.62-17.053c.372-1.487-.564-2.159-1.534-1.72L1.125 10.263c-1.45.582-1.443 1.392-.264 1.753l5.455 1.7L18.94 5.753c.595-.36 1.143-.167.694.232" />
                        </svg>
                    </span> */}

                </div>
            </div>
        )
    }
}
export default CoinSocial;

