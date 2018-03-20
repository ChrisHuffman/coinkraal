import React from 'react';
import { observe } from 'mobx';
import { inject, observer } from 'mobx-react';
import VirtualizedSelect from 'react-virtualized-select';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import CoinLogo from '../../common/CoinLogo'
import moment from 'moment';
import {
    Button, Form, FormGroup, Label, Input, InputGroup, InputGroupText,
    InputGroupAddon, FormText, Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap';


@inject('transactionsPageState', 'transactionStore', 'currencyStore', 'coinStore', 'commonStore')
@observer
class EditSale extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            transaction: null,
            id: '',
            date: new Date(),
            amount: '',
            saleCurrency: '',
            saleUnitPrice: '',
            saleTotalPrice: '',

            enabled: true,

            errors: {}
        }

        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleCurrencyChange = this.handleCurrencyChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.updateSale = this.updateSale.bind(this);
        this.loadUnitPrice = this.loadUnitPrice.bind(this);
        this.loadTotalPrice = this.loadTotalPrice.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.enabled = this.enabled.bind(this);
    }

    componentWillReceiveProps(nextProps) {

        this.setState({
            transaction: nextProps.transaction,
        });

        if (nextProps.sale) {
            this.setState({
                _id: nextProps.sale._id,
                date: new Date(nextProps.sale.date),
                amount: nextProps.sale.amount,
                saleCurrency: nextProps.sale.saleCurrency,
                saleUnitPrice: nextProps.sale.saleUnitPrice
            }, this.loadTotalPrice);
        }
    }

    loadUnitPrice() {

        this.props.coinStore
            .getUnitPrice(this.state.transaction ? this.state.transaction.currency : null, this.state.saleCurrency, this.state.date)

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

    updateSale() {

        var self = this;

        //Disable form
        self.enabled(false);

        //Clear any errors
        self.setState({
            errors: {}
        });

        var date = self.state.date ? self.state.date.toISOString() : '';

        var sale = {
            _id: self.state._id,
            amount: self.state.amount,
            saleCurrency: self.state.saleCurrency,
            saleUnitPrice: self.state.saleUnitPrice,
            date: date
        };

        self.props.transactionStore.updateSale(this.state.transaction._id, sale)
            .then(function (response) {
                self.toggleModal();
            })
            .catch((error) => {

                var errors = error.response.body.errors 

                if (!errors) {
                    self.props.commonStore.notify('Error updating sale', 'error');
                    return;
                }

                //Format errors make sales.1.amount -> amount
                var errorsFormatted = {};
                Object.keys(errors).forEach(function (key) {
                    var keyFormatted = key.split('.').pop();
                    errorsFormatted[keyFormatted] = errors[key];
                });

                self.setState({
                    errors: errorsFormatted
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
        this.props.transactionsPageState.toggleEditSaleModal();
    }

    enabled(enabled) {
        this.setState({
            enabled: enabled
        });
    }

    render() {

        return (

            <div>

                <Modal isOpen={this.props.transactionsPageState.editSaleModal} toggle={this.toggleModal}>
                    
                    <div className="modal-header">
                        <CoinLogo coin={this.state.transaction ? this.state.transaction.currency : ""} />
                        <h5 className="modal-title ml-10">Edit {this.state.transaction ? this.state.transaction.currency : ""} Sale</h5>
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
                                    {this.props.commonStore.getErrorMessage(this.state.errors, 'date', 'Date required')}
                                </div>
                            </FormGroup>
                            <FormGroup>
                                <Label for="amount">Sell</Label>
                                <InputGroup>
                                    <InputGroupAddon addonType="prepend">
                                        {this.state.transaction ? this.state.transaction.currency : ''}
                                    </InputGroupAddon>
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
                                        className={this.props.commonStore.getErrorClass(this.state.errors, 'saleUnitPrice')}
                                        value={this.state.saleUnitPrice}
                                        onChange={this.handleTextChange} />
                                    <div className="invalid-feedback">
                                        {this.props.commonStore.getErrorMessage(this.state.errors, 'saleUnitPrice')}
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
                        <Button outline color="light" onClick={this.updateSale} disabled={!this.state.enabled}>Update Sale</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}
export default EditSale;
