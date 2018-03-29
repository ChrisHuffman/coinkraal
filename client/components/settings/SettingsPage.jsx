import React from 'react';
import { inject, observer } from 'mobx-react';
import ReactDOM from 'react-dom';
import Header from '../common/Header'
import VirtualizedSelect from 'react-virtualized-select';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';

@inject('global', 'userStore')
@observer
export default class SettingPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            defaultFiat: '',
            defaultCoin: '',
            defaultChartTimeRangeDays: '',

            loading: true,
            updating: false
        }

        this.save = this.save.bind(this);
        this.cancel = this.cancel.bind(this);

        this.handleDefaultFiatChange = this.handleDefaultFiatChange.bind(this);
        this.handleDefaultCoinChange = this.handleDefaultCoinChange.bind(this);

        this.props.userStore.getUser()
            .then(user => {
                var settings = user.settings;
                this.setState({
                    loading: false,
                    defaultFiat: settings.find(s => s.name == 'defaultFiat').value,
                    defaultCoin: settings.find(s => s.name == 'defaultCoin').value,
                    defaultChartTimeRangeDays: settings.find(s => s.name == 'defaultChartTimeRangeDays').value,
                })

            })
    }

    save() {

        this.setState({
            updating: true
        });

        var dto = [
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

    render() {

        return (
            <div>
                {(this.props.global.isLoaded && !this.state.loading) &&

                    <div>

                        <Header hideCurrencyItems={true} />

                        <div className="container-fluid mt-3">
                            <div>
                                <div className="row">
                                    <div className="col-md-6">

                                        <h3 className="text-primary mb-4">Settings</h3>

                                        <Form>
                                            <FormGroup>
                                                <Label>Default Fiat</Label>
                                                <VirtualizedSelect className="col-md-4 p-0"
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
                                                <VirtualizedSelect className="col-md-4 p-0"
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
                                            <FormGroup>
                                                <Label>Default Chart Time Range</Label>
                                                <Input type="select" className="col-md-4">
                                                    <option>1</option>
                                                    <option>2</option>
                                                    <option>3</option>
                                                    <option>4</option>
                                                    <option>5</option>
                                                </Input>
                                            </FormGroup>
                                            
                                        </Form>

                                        <div className="col-md-4 text-right pr-0">
                                            <Button outline color="secondary mr-2" onClick={this.cancel}>Cancel</Button>
                                            <Button outline color="primary" onClick={this.save}>Save Settings</Button>
                                        </div>
                                    </div>

                                    <div className="col-md-6">

                                        DONATE MAN!

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

            </div>
        );
    }
}