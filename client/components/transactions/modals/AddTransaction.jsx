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
            purchaseType: 'unit',
            notes: '',

            enabled: true,

            errors: {}
        }

        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleCoinChange = this.handleCoinChange.bind(this);
        this.handleCurrencyChange = this.handleCurrencyChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.addTransaction = this.addTransaction.bind(this);
        this.loadPrice = this.loadPrice.bind(this);
        this.calculatePrice = this.calculatePrice.bind(this);
        this.handlePurchaseTypeChange = this.handlePurchaseTypeChange.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.enabled = this.enabled.bind(this);
    }

    loadPrice() {

        this.props.coinStore
            .getUnitPrice(this.state.currency, this.state.purchaseCurrency, this.state.date)
            .then(price => {
                this.setState({
                    purchaseUnitPrice: price
                }, this.calculatePrice);
            });
    }

    calculatePrice() {

        if (this.state.purchaseType == 'unit') {
            this.setState({
                purchaseTotalPrice: this.props.transactionStore.calculateTotalPrice(this.state.amount, this.state.purchaseUnitPrice)
            });
        }

        if (this.state.purchaseType == 'total') {
            this.setState({
                purchaseUnitPrice: this.props.transactionStore.calculateUnitPrice(this.state.amount, this.state.purchaseTotalPrice)
            });
        }
    }

    addTransaction() {

        var self = this;

        //Disable form
        self.enabled(false);

        //Clear any errors
        self.setState({
            errors: {}
        });

        var date = self.state.date ? self.state.date.toISOString() : '';

        var transaction = {
            currency: self.state.currency,
            amount: self.state.amount,
            purchaseCurrency: self.state.purchaseCurrency,
            purchaseUnitPrice: self.state.purchaseUnitPrice,
            date: date,
            notes: self.state.notes
        };

        self.props.transactionStore.addTransaction(transaction)
            .then(function (response) {
                self.toggleModal();
            })
            .catch((error) => {

                if (!error.response.body.errors) {
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
            }, this.calculatePrice);
        }
        if (e.target.name == "purchaseUnitPrice") {
            this.setState({
                purchaseUnitPrice: e.target.value
            }, this.calculatePrice);
        }
        if (e.target.name == "purchaseTotalPrice") {
            this.setState({
                purchaseTotalPrice: e.target.value
            }, this.calculatePrice);
        }
        if (e.target.name == "notes") {
            this.setState({
                notes: e.target.value
            });
        }
    }

    handleCoinChange(newValue) {
        this.setState({
            currency: newValue
        });
    }

    handleCurrencyChange(newValue) {
        this.setState({
            purchaseCurrency: newValue
        });
    }

    handleDateChange(newValue) {
        this.setState({
            date: newValue
        });
    }

    handlePurchaseTypeChange(newValue) {
        this.setState({
            purchaseType: newValue
        });
    }

    toggleModal() {

        //Clear form
        this.setState({
            date: new Date(),
            currency: '',
            amount: '',
            purchaseCurrency: 'BTC',
            purchaseUnitPrice: '',
            purchaseTotalPrice: '',
            purchaseType: 'unit',
            notes: '',
            errors: {}
        });

        this.props.transactionsPageState.toggleAddTransactionModal();
    }

    enabled(enabled) {
        this.setState({
            enabled: enabled
        });
    }

    render() {

        return (

            <Modal isOpen={this.props.transactionsPageState.addTransactionModal} toggle={this.toggleModal}>
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
                                {this.props.commonStore.getErrorMessage(this.state.errors, 'date')}
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
                            <Label for="purchaseType">Purchased Type</Label>
                            <VirtualizedSelect ref="purchaseType"
                                options={this.props.global.purchaseTypeOptions}
                                simpleValue={true}
                                clearable={false}
                                name="purchaseType"
                                value={this.state.purchaseType}
                                onChange={this.handlePurchaseTypeChange}
                                labelKey="name"
                                valueKey="key"
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="purchaseUnitPrice">Unit Price</Label>
                            {this.state.purchaseType == 'unit' &&
                                <a className="float-right text-secondary clickable" onClick={this.loadPrice}>load unit price</a>
                            }
                            <InputGroup>
                                <InputGroupAddon addonType="prepend">
                                    {this.state.purchaseCurrency}
                                </InputGroupAddon>
                                <Input
                                    name="purchaseUnitPrice"
                                    id="purchaseUnitPrice"
                                    type="number"
                                    disabled={this.state.purchaseType != 'unit'}
                                    className={this.props.commonStore.getErrorClass(this.state.errors, 'purchaseUnitPrice', this.state.purchaseType != 'unit')}
                                    value={this.state.purchaseUnitPrice}
                                    onChange={this.handleTextChange} />
                                <div className="invalid-feedback">
                                    {this.props.commonStore.getErrorMessage(this.state.errors, 'purchaseUnitPrice', this.state.purchaseType != 'unit')}
                                </div>
                            </InputGroup>
                        </FormGroup>
                        <FormGroup>
                            <Label for="purchaseTotalPrice">Total Price</Label>
                            <InputGroup>
                                <InputGroupAddon addonType="prepend">
                                    {this.state.purchaseCurrency}
                                </InputGroupAddon>
                                <Input
                                    name="purchaseTotalPrice"
                                    id="purchaseTotalPrice"
                                    type="number"
                                    disabled={this.state.purchaseType != 'total'}
                                    className={this.props.commonStore.getErrorClass(this.state.errors, 'purchaseUnitPrice', this.state.purchaseType != 'total')}
                                    value={this.state.purchaseTotalPrice}
                                    onChange={this.handleTextChange} />
                                <div className="invalid-feedback">
                                    {this.props.commonStore.getErrorMessage(this.state.errors, 'purchaseUnitPrice', this.state.purchaseType != 'total')}
                                </div>
                            </InputGroup>
                        </FormGroup>
                        <FormGroup>
                            <Label for="notes">Notes</Label>
                            <Input
                                    name="notes"
                                    id="notes"
                                    type="textarea"
                                    className={this.props.commonStore.getErrorClass(this.state.errors, 'notes')}
                                    value={this.state.notes}
                                    onChange={this.handleTextChange} />
                                <div className="invalid-feedback">
                                    {this.props.commonStore.getErrorMessage(this.state.errors, 'notes')}
                                </div>
                        </FormGroup>

                    </Form>

                </ModalBody>
                <ModalFooter>
                    <Button outline color="secondary" onClick={this.toggleModal} disabled={!this.state.enabled}>Cancel</Button>
                    <Button outline color="primary" onClick={this.addTransaction} disabled={!this.state.enabled}>Add Transaction</Button>
                </ModalFooter>
            </Modal>

        )
    }
}
export default AddTransaction;
