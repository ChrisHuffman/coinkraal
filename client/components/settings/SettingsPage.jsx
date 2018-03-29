import React from 'react';
import { inject, observer } from 'mobx-react';
import ReactDOM from 'react-dom';
import Header from '../common/Header'
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';

@inject('global', 'userStore')
@observer
export default class SettingPage extends React.Component {

    constructor(props) {
        super(props);
        this.save = this.save.bind(this);

        this.props.userStore.getSettings()
            .then(settings => {
                console.log(settings);
            })
    }

    save() {
        this.props.history.push("/");
    }

    render() {

        return (
            <div>
                {this.props.global.isLoaded &&

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
                                                <Input type="select" className="col-md-4">
                                                    <option>1</option>
                                                    <option>2</option>
                                                    <option>3</option>
                                                    <option>4</option>
                                                    <option>5</option>
                                                </Input>
                                            </FormGroup>
                                            <FormGroup>
                                                <Label>Default Fiat</Label>
                                                <Input type="select" className="col-md-4">
                                                    <option>1</option>
                                                    <option>2</option>
                                                    <option>3</option>
                                                    <option>4</option>
                                                    <option>5</option>
                                                </Input>
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
                                            <Button outline color="secondary mr-2" onClick={this.save}>Cancel</Button>
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

                {!this.props.global.isLoaded &&
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