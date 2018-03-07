import React from 'react';
import { inject, observer } from 'mobx-react';
import VirtualizedSelect from 'react-virtualized-select';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import moment from 'moment';
import {
    Button, Form, FormGroup, Label, Input, InputGroup, InputGroupText,
    InputGroupAddon, FormText, Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap';


@inject('transactionStore', 'currencyStore', 'commonStore')
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
        this.getErrorMessage = this.getErrorMessage.bind(this);

    }

    loadUnitPrice() {

        if(!this.state.currency || !this.state.purchaseCurrency || !this.state.date) {
            this.setState({
                purchaseUnitPrice: ''
            });
            return;
        }

        var now = moment();
        var date = moment(this.state.date)
                    .set({'hour': now.get('hour'), 'minute': now.get('minute')})
                    .toDate();

        this.props.currencyStore.getHistoricalPrice(this.state.currency, this.state.purchaseCurrency, this.props.commonStore.getUnixTimeStamp(date))
            .then(price => {
                this.setState({
                    purchaseUnitPrice: price
                }, this.loadTotalPrice);
            });
    }

    loadTotalPrice() {

        if(this.state.amount == '' || this.state.purchaseUnitPrice == '')
            return;

        this.setState({
            purchaseTotalPrice: this.state.amount * this.state.purchaseUnitPrice
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

    getErrorMessage(fieldName, message) {
        var error = this.state.errors[fieldName];
        if(!error)
            return '';
        return message || error.message;
    }

    getErrorClass(fieldName) {
        var error = this.state.errors[fieldName];
        if(!error)
            return '';
        return 'is-invalid';
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
                                    {this.getErrorMessage('date', 'Date required')}
                                </div>
                            </FormGroup>
                            <FormGroup>
                                <Label for="currency">Coin</Label>
                                <VirtualizedSelect ref="currency"
                                    name="currency"
                                    options={this.props.currencyStore.currencies}
                                    searchable={true}
                                    simpleValue={true}
                                    clearable={false}
                                    value={this.state.currency}
                                    onChange={this.handleCoinChange}
                                    labelKey="FullName"
                                    valueKey="Symbol"
                                />
                                <div className="invalid-feedback displayBlock">
                                    {this.getErrorMessage('currency')}
                                </div>
                            </FormGroup>
                            <FormGroup>
                                <Label for="amount">Amount</Label>
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
                            </FormGroup>
                            <FormGroup>
                                <Label for="purchaseCurrency">Purchased with</Label>
                                <VirtualizedSelect ref="purchaseCurrency"
                                    options={this.props.currencyStore.purchaseCurrencies}
                                    searchable={true}
                                    simpleValue={true}
                                    clearable={false}
                                    name="purchaseCurrency"
                                    value={this.state.purchaseCurrency}
                                    onChange={this.handleCurrencyChange}
                                    labelKey="FullName"
                                    valueKey="Symbol"
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
                                        className={this.getErrorClass('purchaseUnitPrice')}
                                        value={this.state.purchaseUnitPrice}
                                        onChange={this.handleTextChange} />
                                    <div className="invalid-feedback">
                                        {this.getErrorMessage('purchaseUnitPrice')}
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
