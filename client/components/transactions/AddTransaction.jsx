import React from 'react';
import { inject, observer } from 'mobx-react';
import VirtualizedSelect from 'react-virtualized-select';
import DayPickerInput from 'react-day-picker/DayPickerInput';
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
            type: 'buy',
            in_currency: '',
            in_amount: '',
            in_unitPriceUSD: '',
            date: '',
            enabled: true,
            modal: false
        }

        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleCoinChange = this.handleCoinChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.addTransaction = this.addTransaction.bind(this);
        this.loadInUnitPriceUSD = this.loadInUnitPriceUSD.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.enabled = this.enabled.bind(this);

    }

    loadInUnitPriceUSD() {

        if(!this.state.in_currency || !this.state.date) {
            this.setState({
                in_unitPriceUSD: ''
            });
            return;
        }

        this.props.currencyStore.getHistoricalPrice(this.state.in_currency, 'USD', this.props.commonStore.getUnixTimeStamp(this.state.date))
            .then(price => {
                this.setState({
                    in_unitPriceUSD: price
                });
            });
    }

    addTransaction() {
        
        var self = this;
        self.enabled(false);

        var transaction = {
            type: self.state.type,
            in_currency: self.state.in_currency,
            in_amount: self.state.in_amount,
            in_unitPriceUSD: self.state.in_unitPriceUSD,
            date: new Date(self.state.date).toISOString()
        };

        this.props.transactionStore.addTransaction(transaction)
            .then(function (response) {
                self.toggleModal();
            })
            .catch((error) => {
                self.props.commonStore.notify('Error adding transaction', 'error');
            })
            .then(() => {
                self.enabled(true);
            });
    }

    handleTextChange(e) {
        if (e.target.name == "in_amount") {
            this.setState({
                in_amount: e.target.value
            });
        }
    }

    handleCoinChange(newValue) {
        this.setState({
            in_currency: newValue
        }, this.loadInUnitPriceUSD);
    }

    handleDateChange(newValue) {
        this.setState({
            date: newValue
        }, this.loadInUnitPriceUSD);
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
                            </FormGroup>
                            <FormGroup>
                                <Label for="in_currency">Coin</Label>
                                <VirtualizedSelect ref="in_currency"
                                    options={this.props.currencyStore.currencies}
                                    simpleValue
                                    clearable
                                    name="in_currency"
                                    value={this.state.in_currency}
                                    onChange={this.handleCoinChange}
                                    searchable
                                    labelKey="FullName"
                                    valueKey="Symbol"
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="in_amount">Amount</Label>
                                <Input
                                    name="in_amount"
                                    id="in_amount"
                                    placeholder="10"
                                    value={this.state.in_amount}
                                    onChange={this.handleTextChange} />
                            </FormGroup>
                            <FormGroup>
                                <Label for="in_unitPriceUSD">Unit Price (USD)</Label>
                                <InputGroup>
                                    <InputGroupAddon addonType="prepend">
                                        $
                                    </InputGroupAddon>
                                    <Input
                                        name="in_unitPriceUSD"
                                        id="in_unitPriceUSD"
                                        value={this.state.in_unitPriceUSD} />
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
