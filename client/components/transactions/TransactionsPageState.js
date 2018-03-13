import { observable, action } from 'mobx';

export class TransactionsPageState {

    @observable selectedTransaction = null;
    @observable removeTransactionModal = false;
    @observable editTransactionModal = false;

    @observable selectedSale = null;
    @observable addSaleModal = false;
    @observable editSaleModal = false;
    @observable removeSaleModal = false;

    constructor() {
    }

    @action toggleEditTransactionModal(transaction) {
        this.selectedTransaction = transaction;
        this.editTransactionModal = !this.editTransactionModal;
    }

    @action toggleRemoveTransactionModal(transaction) {
        this.selectedTransaction = transaction;
        this.removeTransactionModal = !this.removeTransactionModal;
    }

    @action toggleAddSaleModal(transaction) {
        this.selectedTransaction = transaction;
        this.addSaleModal = !this.addSaleModal;
    }

    @action toggleEditSaleModal(transaction, sale) {
        this.selectedTransaction = transaction;
        this.selectedSale = sale;
        this.editSaleModal = !this.editSaleModal;
    }

    @action toggleRemoveSaleModal(transaction, sale) {
        this.selectedTransaction = transaction;
        this.selectedSale = sale;
        this.removeSaleModal = !this.removeSaleModal;
    }
}

export default TransactionsPageState;