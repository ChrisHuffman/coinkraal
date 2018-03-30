import { observable, action, computed } from 'mobx';
import { CommonService } from '../../services/CommonService';

export class TransactionsPageState {

    transactionStore = null;

    @observable selectedTransaction = null;
    @observable addTransactionModal = false;
    @observable removeTransactionModal = false;
    @observable editTransactionModal = false;

    @observable selectedSale = null;
    @observable addSaleModal = false;
    @observable editSaleModal = false;
    @observable removeSaleModal = false;

    @observable pageIndex = 0;
    pageSize = 10;
    @observable showZeroBalanceTransactions = false;

    constructor(transactionStore) {
        this.transactionStore = transactionStore;
    }

    @action toggleAddTransactionModal() {
        this.addTransactionModal = !this.addTransactionModal;
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

    @computed get transactions() {

        var start = this.pageIndex * this.pageSize;
        var page = this.filteredTransactions.slice(start, start + this.pageSize);

        //Sort?
        return page;
    }

    @computed get filteredTransactions() {
        return this.transactionStore.transactions.filter(t => {
            if(this.showZeroBalanceTransactions)
                return true;
            return this.transactionStore.getTransactionAmountBalance(t) != 0;
        });
    }

    @action nextPage() {
        this.pageIndex += 1;
    }

    @action previousPage() {
        this.pageIndex -= 1;
    }

    @computed get isFirstPage() {
        return this.pageIndex == 0;
    }

    @computed get isLastPage() {
        return this.filteredTransactions.length - (this.pageIndex * this.pageSize) <= this.pageSize;
    }

    @action toggleZeroBalanceTransactions() {
        this.pageIndex = 0;
        this.showZeroBalanceTransactions = !this.showZeroBalanceTransactions;
    }
}

export default TransactionsPageState;