import React from 'react';
import { inject, observer } from 'mobx-react';
import VirtualizedSelect from 'react-virtualized-select';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import moment from 'moment';
import {
    Button, Form, FormGroup, Label, Input, InputGroup, InputGroupText,
    InputGroupAddon, FormText, Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap';


@inject('global', 'transactionsPageState', 'transactionStore', 'currencyStore', 'coinStore', 'commonStore')
@observer
class AddTransaction extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            date: new Date(),
            currency: '',
            amount: '',
            purchaseCurrency: 'BTC',
            purchaseUnitPrice: '',
            purchaseTotalPrice: '',
            
            enabled: true,
            modal: false,

            errors: { }
        }

        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleCoinChange = this.handleCoinChange.bind(this);
        this.handleCurrencyChange = this.handleCurrencyChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.addTransaction = this.addTransaction.bind(this);
        this.loadUnitPrice = this.loadUnitPrice.bind(this);
        this.loadTotalPrice = this.loadTotalPrice.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.enabled = this.enabled.bind(this);
    }

    loadUnitPrice() {

        this.props.coinStore
            .getUnitPrice(this.state.currency, this.state.purchaseCurrency, this.state.date)

            .then(price => {

                this.setState({
                    purchaseUnitPrice: price
                }, this.loadTotalPrice);
            });
    }

    loadTotalPrice() {

        var totalPrice = '';

        if(this.state.amount != '' && this.state.purchaseUnitPrice != '')
            totalPrice = this.state.amount * this.state.purchaseUnitPrice;

        this.setState({
            purchaseTotalPrice: totalPrice
        });
    }

    addTransaction() {
        
        var self = this;

        //Disable form
        self.enabled(false);

        //Clear any errors
        self.setState({
            errors: { }
        });

        var date = self.state.date ? self.state.date.toISOString() : '';

        var transaction = {
            currency: self.state.currency,
            amount: self.state.amount,
            purchaseCurrency: self.state.purchaseCurrency,
            purchaseUnitPrice: self.state.purchaseUnitPrice,
            date: date
        };

        self.props.transactionStore.addTransaction(transaction)
            .then(function (response) {
                self.toggleModal();
            })
            .catch((error) => {

                if(!error.response.body.errors) {
                    self.props.commonStore.notify('Error adding transaction', 'error');
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
        if (e.target.name == "purchaseUnitPrice") {
            this.setState({
                purchaseUnitPrice: e.target.value
            }, this.loadTotalPrice);
        }
    }

    handleCoinChange(newValue) {
        this.setState({
            currency: newValue
        }, this.loadUnitPrice);
    }

    handleCurrencyChange(newValue) {
        this.setState({
            purchaseCurrency: newValue
        }, this.loadUnitPrice);
    }

    handleDateChange(newValue) {
        this.setState({
            date: newValue
        }, this.loadUnitPrice);
    }

    toggleModal() {
        this.setState({
            modal: !this.state.modal
        });
    }

    enabled(enabled) {
        this.setState({
            enabled: enabled
        });
    }

    render() {

        return (
            <div>

                <Button outline color="primary" size="sm" onClick={this.toggleModal}>Add Transaction</Button>

                <Modal isOpen={this.state.modal} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Add Transaction</ModalHeader>
                    <ModalBody>
                        <Form>
                            <FormGroup>
                                <Label for="date">Date</Label>
                                <DayPickerInput
                                    onDayChange={this.handleDateChange}
                                    value={this.state.date}
                                />
                                <div className="invalid-feedback displayBlock">
                                    {this.props.commonStore.getErrorMessage(this.state.errors, 'date', 'Date required')}
                                </div>
                            </FormGroup>
                            <FormGroup>
                                <Label for="currency">Coin</Label>
                                <VirtualizedSelect ref="currency"
                                    name="currency"
                                    options={this.props.coinStore.coins}
                                    searchable={true}
                                    simpleValue={true}
                                    clearable={false}
                                    value={this.state.currency}
                                    onChange={this.handleCoinChange}
                                    labelKey="fullName"
                                    valueKey="symbol"
                                />
                                <div className="invalid-feedback displayBlock">
                                    {this.props.commonStore.getErrorMessage(this.state.errors, 'currency')}
                                </div>
                            </FormGroup>
                            <FormGroup>
                                <Label for="amount">Amount</Label>
                                <Input
                                    className={this.props.commonStore.getErrorClass(this.state.errors, 'amount')}
                                    name="amount"
                                    id="amount"
                                    type="number"
                                    value={this.state.amount}
                                    onChange={this.handleTextChange} />
                                    <div className="invalid-feedback">
                                        {this.props.commonStore.getErrorMessage(this.state.errors, 'amount')}
                                    </div>
                            </FormGroup>
                            <FormGroup>
                                <Label for="purchaseCurrency">Purchased with</Label>
                                <VirtualizedSelect ref="purchaseCurrency"
                                    options={this.props.global.supportedCurrencies}
                                    searchable={true}
                                    simpleValue={true}
                                    clearable={false}
                                    name="purchaseCurrency"
                                    value={this.state.purchaseCurrency}
                                    onChange={this.handleCurrencyChange}
                                    labelKey="fullName"
                                    valueKey="symbol"
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="purchaseUnitPrice">Unit Price</Label>
                                <InputGroup>
                                    <InputGroupAddon addonType="prepend">
                                        {this.state.purchaseCurrency}
                                    </InputGroupAddon>
                                    <Input
                                        name="purchaseUnitPrice"
                                        id="purchaseUnitPrice"
                                        type="number"
                                        className={this.props.commonStore.getErrorClass(this.state.errors, 'purchaseUnitPrice')}
                                        value={this.state.purchaseUnitPrice}
                                        onChange={this.handleTextChange} />
                                    <div className="invalid-feedback">
                                        {this.props.commonStore.getErrorMessage(this.state.errors, 'purchaseUnitPrice')}
                                    </div>
                                </InputGroup>
                            </FormGroup>
                            <FormGroup>
                                <Label for="purchaseUnitPrice">Total Price</Label>
                                <InputGroup>
                                    <InputGroupAddon addonType="prepend">
                                        {this.state.purchaseCurrency}
                                    </InputGroupAddon>
                                    <Input
                                        name="purchaseTotalPrice"
                                        id="purchaseTotalPrice"
                                        disabled={true}
                                        value={this.state.purchaseTotalPrice} />
                                </InputGroup>
                            </FormGroup>

                        </Form>

                    </ModalBody>
                    <ModalFooter>
                        <Button outline color="secondary" onClick={this.toggleModal} disabled={!this.state.enabled}>Cancel</Button>
                        <Button outline color="light" onClick={this.addTransaction} disabled={!this.state.enabled}>Add Transaction</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}
export default AddTransaction;
