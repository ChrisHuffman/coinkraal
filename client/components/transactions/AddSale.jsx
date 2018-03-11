import React from 'react';
import { inject, observer } from 'mobx-react';
import VirtualizedSelect from 'react-virtualized-select';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import CoinLogo from '../common/CoinLogo'
import moment from 'moment';
import {
    Button, Form, FormGroup, Label, Input, InputGroup, InputGroupText,
    InputGroupAddon, FormText, Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap';


@inject('transactionStore', 'currencyStore', 'commonStore')
@observer
class AddSale extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            transaction: null,
            date: new Date(),
            amount: '',
            saleCurrency: 'BTC',
            saleUnitPrice: '',
            saleTotalPrice: '',

            enabled: true,

            errors: {}
        }

        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.addSale = this.addSale.bind(this);
        this.handleCurrencyChange = this.handleCurrencyChange.bind(this);
        this.loadUnitPrice = this.loadUnitPrice.bind(this);
        this.loadTotalPrice = this.loadTotalPrice.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.enabled = this.enabled.bind(this);
        this.getErrorMessage = this.getErrorMessage.bind(this);
    }

    componentWillReceiveProps(nextProps) {

        if (!nextProps.transaction)
            return;

        this.setState({
            transaction: nextProps.transaction
        }, this.loadUnitPrice);
    }

    loadUnitPrice() {

        this.props.currencyStore
            .getUnitPrice(this.state.transaction.currency, this.state.saleCurrency, this.state.date)

            .then(price => {

                this.setState({
                    saleUnitPrice: price
                }, this.loadTotalPrice);
            });
    }

    loadTotalPrice() {

        var totalPrice = '';

        if (this.state.amount != '' && this.state.saleUnitPrice != '')
            totalPrice = this.state.amount * this.state.saleUnitPrice;

        this.setState({
            saleTotalPrice: totalPrice
        });
    }

    addSale() {

        var self = this;

        //Disable form
        self.enabled(false);

        //Clear any errors
        self.setState({
            errors: {}
        });

        var date = self.state.date ? self.state.date.toISOString() : '';

        var sale = {
            date: date,
            amount: self.state.amount,
            saleCurrency: self.state.saleCurrency,
            saleUnitPrice: self.state.saleUnitPrice,
            notes: ''
        };

        self.props.transactionStore.addSale(self.state.transaction._id, sale)
            .then(function (response) {
                self.toggleModal();
            })
            .catch((error) => {

                if (!error.response.body.errors) {
                    self.props.commonStore.notify('Error adding sale', 'error');
                    return;
                }

                self.setState({
                    errors: error.response.body.errors
                });
            })
            .then(() => {
                self.enabled(true);
            });
    }

    handleTextChange(e) {
        if (e.target.name == "amount") {
            this.setState({
                amount: e.target.value
            }, this.loadTotalPrice);
        }
        if (e.target.name == "saleUnitPrice") {
            this.setState({
                saleUnitPrice: e.target.value
            }, this.loadTotalPrice);
        }
    }

    handleCurrencyChange(newValue) {
        this.setState({
            saleCurrency: newValue
        }, this.loadUnitPrice);
    }

    handleDateChange(newValue) {
        this.setState({
            date: newValue
        }, this.loadUnitPrice);
    }

    toggleModal() {
        this.props.transactionStore.toggleAddSaleModal();
    }

    enabled(enabled) {
        this.setState({
            enabled: enabled
        });
    }

    getErrorMessage(fieldName, message) {
        var error = this.state.errors[fieldName];
        if (!error)
            return '';
        return message || error.message;
    }

    getErrorClass(fieldName) {
        var error = this.state.errors[fieldName];
        if (!error)
            return '';
        return 'is-invalid';
    }

    render() {

        return (
            <div>

                <Modal isOpen={this.props.transactionStore.addSaleModal} toggle={this.toggleModal}>

                    <div className="modal-header">
                        <CoinLogo coin={this.state.transaction ? this.state.transaction.currency : ""} />
                        <h5 className="modal-title ml-10">Sell {this.state.transaction ? this.state.transaction.currency : ""}</h5>
                        <button type="button" className="close" aria-label="Close" onClick={this.toggleModal}><span aria-hidden="true">&times;</span></button>
                    </div>

                    <ModalBody>
                        <Form>
                            <FormGroup>
                                <Label for="date">Date</Label>
                                <DayPickerInput
                                    onDayChange={this.handleDateChange}
                                    value={this.state.date}
                                />
                                <div className="invalid-feedback displayBlock">
                                    {this.getErrorMessage('date', 'Date required')}
                                </div>
                            </FormGroup>
                            <FormGroup>
                                <Label for="amount">Sell</Label>
                                <InputGroup>
                                    <InputGroupAddon addonType="prepend">
                                        {this.state.transaction ? this.state.transaction.currency : ''}
                                    </InputGroupAddon>
                                    <Input
                                        className={this.getErrorClass('amount')}
                                        name="amount"
                                        id="amount"
                                        type="number"
                                        value={this.state.amount}
                                        onChange={this.handleTextChange} />
                                    <div className="invalid-feedback">
                                        {this.getErrorMessage('amount')}
                                    </div>
                                </InputGroup>
                            </FormGroup>
                            <FormGroup>
                                <Label for="saleCurrency">For</Label>
                                <VirtualizedSelect ref="saleCurrency"
                                    options={this.props.currencyStore.purchaseCurrencies}
                                    searchable={true}
                                    simpleValue={true}
                                    clearable={false}
                                    name="saleCurrency"
                                    value={this.state.saleCurrency}
                                    onChange={this.handleCurrencyChange}
                                    labelKey="fullName"
                                    valueKey="symbol"
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="saleUnitPrice">At Unit Price</Label>
                                <InputGroup>
                                    <InputGroupAddon addonType="prepend">
                                        {this.state.saleCurrency}
                                    </InputGroupAddon>
                                    <Input
                                        name="saleUnitPrice"
                                        id="saleUnitPrice"
                                        type="number"
                                        className={this.getErrorClass('saleUnitPrice')}
                                        value={this.state.saleUnitPrice}
                                        onChange={this.handleTextChange} />
                                    <div className="invalid-feedback">
                                        {this.getErrorMessage('saleUnitPrice')}
                                    </div>
                                </InputGroup>
                            </FormGroup>
                            <FormGroup>
                                <Label for="saleUnitPrice">Total Sales</Label>
                                <InputGroup>
                                    <InputGroupAddon addonType="prepend">
                                        {this.state.saleCurrency}
                                    </InputGroupAddon>
                                    <Input
                                        name="saleTotalPrice"
                                        id="saleTotalPrice"
                                        disabled={true}
                                        value={this.state.saleTotalPrice} />
                                </InputGroup>
                            </FormGroup>

                        </Form>

                    </ModalBody>
                    <ModalFooter>
                        <Button outline color="secondary" onClick={this.toggleModal} disabled={!this.state.enabled}>Cancel</Button>
                        <Button outline color="light" onClick={this.addSale} disabled={!this.state.enabled}>Sell Coin</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}
export default AddSale;
