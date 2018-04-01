import { observable, action, computed } from 'mobx';
import agent from '../agent';
import { BigNumber } from 'bignumber.js';

export class TransactionStore {

  @observable transactions = [];
  @observable isLoading = true;

  constructor() {
  }

  @action loadTransactions() {
    this.isLoading = true;
    return agent.Transactions.getTransactions()
      .then(action((transactions) => {
        this.transactions = transactions;
        //console.log('TransactionStore: transactions loaded')
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

  removeTransaction(id) {
    return agent.Transactions.remove(id)
      .then(action(() => {
        //TODO: rather just remove the transaction from the list
        this.loadTransactions();
      }));
  }

  addSale(transactionId, sale) {
    return agent.Sales.add(transactionId, sale)
      .then(action(() => {
        this.loadTransactions();
      }));
  }

  updateSale(transactionId, sale) {
    return agent.Sales.update(transactionId, sale)
      .then(action(() => {
        this.loadTransactions();
      }));
  }

  removeSale(transactionId, saleId) {
    return agent.Sales.remove(transactionId, saleId)
      .then(action(() => {
        //TODO: rather just remove the sale from the list
        this.loadTransactions();
      }));
  }

  getTransactionAmountBalance(transaction) {

    if (!transaction.sales || transaction.sales.length == 0)
      return transaction.amount;

    var salesAmount = transaction.sales
      .map(s => s.amount)
      .reduce((a1, a2) => a1 + a2, 0);

    return new BigNumber(transaction.amount.toString()).minus(salesAmount).toNumber();
  }

  calculateTotalPrice(amount, purchaseUnitPrice) {

    if (amount == '' || purchaseUnitPrice == '')
      return '';

    return new BigNumber(amount.toString()).multipliedBy(purchaseUnitPrice.toString()).toNumber();
  }

  calculateUnitPrice(amount, purchaseTotalPrice) {

    if (amount == '' || purchaseTotalPrice == '')
      return '';

    return new BigNumber(purchaseTotalPrice.toString()).dividedBy(amount.toString()).toNumber();
  }

}

export default TransactionStore;