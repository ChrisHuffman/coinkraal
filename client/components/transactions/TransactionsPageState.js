import { observable, observe, action } from 'mobx';

export class TransactionsPageState {

    @observable selectedTransaction = null;
    @observable removeTransactionModal = false;
    @observable editTransactionModal = false;
    @observable addSaleModal = false;

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
}

export default TransactionsPageState;