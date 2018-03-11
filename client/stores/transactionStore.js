import { observable, action, computed } from 'mobx';
import agent from '../agent';

export class TransactionStore {
  
  @observable transactions = observable([{}]); //Slight hack, set a empty obj so that an empty list of transactions with still trigger obs events

  @observable isLoading = false;
  @observable selectedTransaction = null;
  @observable removeTransactionModal = false;
  @observable editTransactionModal = false;
  @observable addSaleModal = false;

  constructor() {
  }

  @action loadTransactions() {
    this.isLoading = true;
    return agent.Transactions.getTransactions()
      .then(action((transactions) => {
        this.transactions.replace(transactions);
        console.log('TransactionStore: transactions loaded')
      }))
      .finally(action(() => { this.isLoading = false; }));
  }

  addTransaction(transaction) {
    return agent.Transactions.add(transaction)
      .then(action(() => {
        this.loadTransactions();
      }));
  }

  updateTransaction(transaction) {
    return agent.Transactions.update(transaction)
      .then(action(() => {
        //TODO: rather just update the transaction in the list
        this.loadTransactions();
      }));
  }

  @action toggleEditTransactionModal(transaction) {
    this.selectedTransaction = transaction;
    this.editTransactionModal = !this.editTransactionModal;
  }

  removeTransaction(id) {
    return agent.Transactions.remove(id)
      .then(action(() => {
        //TODO: rather just remove the transaction from the list
        this.loadTransactions();
      }));
  }
  
  @action toggleRemoveTransactionModal(transaction) {
    this.selectedTransaction = transaction;
    this.removeTransactionModal = !this.removeTransactionModal;
  }

  addSale(transactionId, sale) {
    return agent.Sales.add(transactionId, sale)
      .then(action(() => {
        this.loadTransactions();
      }));
  }

  @action toggleAddSaleModal(transaction) {
    this.selectedTransaction = transaction;
    this.addSaleModal = !this.addSaleModal;
  }
}

export default TransactionStore;