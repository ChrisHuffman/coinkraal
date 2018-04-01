import React from 'react';
import { observe } from 'mobx';
import { inject, observer } from 'mobx-react';
import VirtualizedSelect from 'react-virtualized-select';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import moment from 'moment';
import {
    Button, Form, FormGroup, Label, Input, InputGroup, InputGroupText,
    InputGroupAddon, FormText, Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap';


@inject('transactionsPageState', 'transactionStore', 'global', 'coinStore', 'commonStore')
@observer
class EditTransaction extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            id: '',
            date: new Date(),
            currency: '',
            amount: '',
            purchaseCurrency: '',
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
        this.updateTransaction = this.updateTransaction.bind(this);
        this.loadPrice = this.loadPrice.bind(this);
        this.calculatePrice = this.calculatePrice.bind(this);
        this.handlePurchaseTypeChange = this.handlePurchaseTypeChange.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.enabled = this.enabled.bind(this);
    }

    componentWillReceiveProps(nextProps) {

        if (!nextProps.transaction)
            return;

        this.setState({
            _id: nextProps.transaction._id,
            date: new Date(nextProps.transaction.date),
            currency: nextProps.transaction.currency,
            amount: nextProps.transaction.amount,
            purchaseCurrency: nextProps.transaction.purchaseCurrency,
            purchaseUnitPrice: nextProps.transaction.purchaseUnitPrice,
            notes: nextProps.transaction.notes,
            errors: {}
        }, this.calculatePrice);
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

    updateTransaction() {

        var self = this;

        //Disable form
        self.enabled(false);

        //Clear any errors
        self.setState({
            errors: {}
        });

        var date = self.state.date ? self.state.date.toISOString() : '';

        var transaction = {
            _id: self.state._id,
            currency: self.state.currency,
            amount: self.state.amount,
            purchaseCurrency: self.state.purchaseCurrency,
            purchaseUnitPrice: self.state.purchaseUnitPrice,
            date: date,
            notes: self.state.notes
        };

        self.props.transactionStore.updateTransaction(transaction)
            .then(function (response) {
                self.toggleModal();
            })
            .catch((error) => {

                if (!error.response.body.errors) {
                    self.props.commonStore.notify('Error updating transaction', 'error');
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

    handlePurchaseTypeChange(newValue) {
        this.setState({
            purchaseType: newValue
        });
    }

    toggleModal() {
        this.props.transactionsPageState.toggleEditTransactionModal();
    }

    enabled(enabled) {
        this.setState({
            enabled: enabled
        });
    }

    render() {

        return (

            <div>

                <Modal isOpen={this.props.transactionsPageState.editTransactionModal} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Edit Transaction</ModalHeader>
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
                        <Button outline color="primary" onClick={this.updateTransaction} disabled={!this.state.enabled}>Update Transaction</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}
export default EditTransaction;
