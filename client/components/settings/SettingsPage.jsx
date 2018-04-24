import React from 'react';
import { inject, observer } from 'mobx-react';
import ReactDOM from 'react-dom';
import Header from '../common/Header'
import CoinLogo from '../common/CoinLogo'
import VirtualizedSelect from 'react-virtualized-select';
import {
    Button, Form, FormGroup, Label, Input, FormText, Alert,
    Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap';

@inject('global', 'userStore')
@observer
export default class SettingPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            defaultFiat: '',
            defaultCoin: '',

            loading: true,
            updating: false,

            modalEthDonation: false,
            modalBtcDonation: false,
            modalRRDonation: false
        }

        this.save = this.save.bind(this);
        this.cancel = this.cancel.bind(this);

        this.handleDefaultFiatChange = this.handleDefaultFiatChange.bind(this);
        this.handleDefaultCoinChange = this.handleDefaultCoinChange.bind(this);

        this.toggleEthDonation = this.toggleEthDonation.bind(this);
        this.toggleBtcDonation = this.toggleBtcDonation.bind(this);
        this.toggleRRDonation = this.toggleRRDonation.bind(this);

        this.props.userStore.getUser()
            .then(user => {
                let settings = user.settings;
                this.setState({
                    loading: false,
                    defaultFiat: settings.find(s => s.name == 'defaultFiat').value,
                    defaultCoin: settings.find(s => s.name == 'defaultCoin').value
                })

            })
    }

    save() {

        this.setState({
            updating: true
        });

        let dto = [
            { name: 'defaultFiat', value: this.state.defaultFiat },
            { name: 'defaultCoin', value: this.state.defaultCoin }
        ];

        this.props.global.setSelectedFiat(this.state.defaultFiat);
        this.props.global.setSelectedCoin(this.state.defaultCoin);

        this.props.userStore.updateSettings(dto)
            .then(() => {
                this.setState({
                    updating: false
                });
                this.props.history.push("/");
            })
    }

    cancel() {
        this.props.history.push("/");
    }

    handleDefaultFiatChange(newValue) {
        this.setState({
            defaultFiat: newValue
        });
    }

    handleDefaultCoinChange(newValue) {
        this.setState({
            defaultCoin: newValue
        });
    }

    toggleEthDonation() {
        this.setState({
            modalEthDonation: !this.state.modalEthDonation
        });
    }

    toggleBtcDonation() {
        this.setState({
            modalBtcDonation: !this.state.modalBtcDonation
        });
    }

    toggleRRDonation() {
        this.setState({
            modalRRDonation: !this.state.modalRRDonation
        });
    }

    render() {

        return (
            <div>
                {(this.props.global.isLoaded && !this.state.loading) &&

                    <div>
                        <div className="container mt-3">
                            <div className="row justify-content-center mt-5">
                                <div className="col-8 col-sm-6 col-md-5 col-lg-4">
                                    <img src="logo_full.png" width="100%" />
                                </div>
                            </div>

                            {this.props.global.isFirstLogin &&
                                <div className="row justify-content-center mt-5">
                                    <div className="col">
                                        <Alert color="primary">
                                            <h5 className="alert-heading">Welcome to COIN<strong>KRAAL</strong></h5>
                                            <p className="mt-3">
                                                The site is currently in <strong>beta</strong>, any feedback and/or bug reports would be much appreciated :) This site contains no adverts and has been put together by a single dev with a love for all things coding and crypto.
                                        </p>
                                            <hr />
                                            <p className="mb-0">
                                                Please choose your favoured <strong>fiat</strong> and <strong>crypto</strong> currencies below, you can always update these later on the <strong>settings</strong> page
                                        </p>
                                        </Alert>
                                    </div>
                                </div>
                            }

                            {!this.props.global.isFirstLogin &&
                                <div className="mt-5 mb-2">&nbsp;</div>
                            }

                            <div className="row mt-3">
                                <div className="col-md-6 mb-3">

                                    <h3 className="text-primary mb-4">Settings</h3>

                                    <Form>
                                        <FormGroup>
                                            <Label>Default Fiat</Label>
                                            <VirtualizedSelect className="p-0"
                                                options={this.props.global.fiatOptions}
                                                simpleValue={true}
                                                clearable={false}
                                                name="defaultFiat"
                                                value={this.state.defaultFiat}
                                                onChange={this.handleDefaultFiatChange}
                                                labelKey="fullName"
                                                valueKey="symbol"
                                            />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label>Default Coin</Label>
                                            <VirtualizedSelect className="p-0"
                                                options={this.props.global.coinOptions}
                                                simpleValue={true}
                                                clearable={false}
                                                name="defaultCoin"
                                                value={this.state.defaultCoin}
                                                onChange={this.handleDefaultCoinChange}
                                                labelKey="fullName"
                                                valueKey="symbol"
                                            />
                                        </FormGroup>

                                    </Form>

                                    {this.props.global.isFirstLogin &&
                                        <div className="text-right pr-0">
                                            <Button color="primary" onClick={this.save}>Enter Site ></Button>
                                        </div>
                                    }

                                     {!this.props.global.isFirstLogin &&
                                        <div className="text-right pr-0">
                                            <Button outline color="secondary mr-2" onClick={this.cancel}>Cancel</Button>
                                            <Button outline color="primary" onClick={this.save}>Save Settings</Button>
                                        </div>
                                    }

                                </div>

                                <div className="col-md-6">

                                    <h3 className="text-primary mb-4">About</h3>

                                    <div className="row">
                                        <div className="col-md-3 font-weight-bold">
                                            Version:
                                        </div>
                                        <div className="col-md-9">
                                            0.3 - beta
                                        </div>
                                    </div>

                                    <div className="row mt-3">
                                        <div className="col-md-3 font-weight-bold">
                                            Thank you to:
                                        </div>
                                        <div className="col-md-9">
                                            <a href="https://www.cryptocompare.com" target="_blank">CryptoCompare</a> and <a href="https://coinmarketcap.com/" target="_blank">CoinMarketCap</a> for the use of their public APIs.
                                        </div>
                                    </div>

                                    <div className="row mt-3">
                                        <div className="col-md-3 font-weight-bold">
                                            Contact:
                                        </div>
                                        <div className="col-md-9">
                                            coinkraal.crypto@gmail.com
                                        </div>
                                    </div>

                                    <div className="row mt-3">
                                        <div className="col-md-3 font-weight-bold">
                                            Donations:
                                        </div>
                                        <div className="col-md-9 text-primary">
                                            <span className="clickable" onClick={this.toggleEthDonation}>Ethereum</span><br />
                                            <span className="clickable" onClick={this.toggleBtcDonation}>Bitcoin</span><br />
                                            <span className="clickable" onClick={this.toggleRRDonation}>Bitconnect</span>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                }

                {(!this.props.global.isLoaded || this.state.loading) &&
                    <div className="container-fluid">
                        <div className="row justify-content-center">
                            <div className="col-auto mt-40">
                                {/* <Loader visible={!this.props.global.isLoaded} /> */}
                                loading....
                            </div>
                        </div>
                    </div>
                }

                <Modal isOpen={this.state.modalEthDonation} toggle={this.toggleEthDonation}>
                    <div className="modal-header">
                        <CoinLogo coin="ETH" />
                        <h5 className="modal-title ml-3">Ethereum Donation</h5>
                        <button type="button" className="close" aria-label="Close" onClick={this.toggleEthDonation}><span aria-hidden="true">&times;</span></button>
                    </div>
                    <ModalBody>
                        <p>Thank you :)</p>
                        <p className="responsive-text mt-4">0x7e5B5436117CE053514A2b572F6Ffe19f8A41AC5</p>
                    </ModalBody>
                    <ModalFooter>
                        <Button outline color="secondary" onClick={this.toggleEthDonation}>Close</Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.modalBtcDonation} toggle={this.toggleBtcDonation}>
                    <div className="modal-header">
                        <CoinLogo coin="BTC" />
                        <h5 className="modal-title ml-3">Bitcoin Donation</h5>
                        <button type="button" className="close" aria-label="Close" onClick={this.toggleBtcDonation}><span aria-hidden="true">&times;</span></button>
                    </div>
                    <ModalBody>
                        <p>Thank you :)</p>
                        <p className="responsive-text mt-4">3L5hZbMyWSzE5FP5HrzjM8CK27xfte2AMW</p>
                    </ModalBody>
                    <ModalFooter>
                        <Button outline color="secondary" onClick={this.toggleBtcDonation}>Close</Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.modalRRDonation} toggle={this.toggleRRDonation} size="md">
                    <div className="modal-header">
                        <CoinLogo coin="BCC" />
                        <h5 className="modal-title ml-3">Bitconnect Donations</h5>
                        <button type="button" className="close" aria-label="Close" onClick={this.toggleRRDonation}><span aria-hidden="true">&times;</span></button>
                    </div>
                    <ModalBody>
                        <iframe width="100%" height="300px" src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" frameBorder="0" allow="autoplay; encrypted-media"></iframe>
                    </ModalBody>
                    <ModalFooter>
                        <Button outline color="secondary" onClick={this.toggleRRDonation}>got em</Button>
                    </ModalFooter>
                </Modal>


            </div>
        );
    }
}