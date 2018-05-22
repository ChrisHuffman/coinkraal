import { observable, action, computed } from 'mobx';
import { BigNumber } from 'bignumber.js';

export class TransactionStore {

  @observable transactions = [];
  @observable isLoading = true;

  constructor(agent) {
    this.agent = agent;
  }

  @action loadTransactions() {
    this.isLoading = true;
    return this.agent.Transaction.getTransactions()
      .then(action((transactions) => {
        this.transactions = transactions;
        //console.log('TransactionStore: transactions loaded')
      }))
      .finally(action(() => { this.isLoading = false; }));
  }

  addTransaction(transaction) {
    return this.agent.Transaction.add(transaction)
      .then(action(() => {
        this.loadTransactions();
      }));
  }

  updateTransaction(transaction) {
    return this.agent.Transaction.update(transaction)
      .then(action(() => {
        //TODO: rather just update the transaction in the list
        this.loadTransactions();
      }));
  }

  removeTransaction(id) {
    return this.agent.Transaction.remove(id)
      .then(action(() => {
        //TODO: rather just remove the transaction from the list
        this.loadTransactions();
      }));
  }

  addSale(transactionId, sale) {
    return this.agent.Sale.add(transactionId, sale)
      .then(action(() => {
        this.loadTransactions();
      }));
  }

  updateSale(transactionId, sale) {
    return this.agent.Sale.update(transactionId, sale)
      .then(action(() => {
        this.loadTransactions();
      }));
  }

  removeSale(transactionId, saleId) {
    return this.agent.Sale.remove(transactionId, saleId)
      .then(action(() => {
        //TODO: rather just remove the sale from the list
        this.loadTransactions();
      }));
  }

  getTransactionAmountBalance(transaction) {

    if (!transaction.sales || transaction.sales.length == 0)
      return transaction.amount;

    let salesAmount = transaction.sales
      .map(s => s.amount)
      .reduce((a1, a2) => a1 + a2, 0);

    return new BigNumber(transaction.amount.toString()).minus(salesAmount.toString()).toNumber();
  }

  getUniqueCurrencies() {
    let currencies = this.transactions.map(t => {
      return t.currency;
    })
    return currencies.filter(this.unique);
  }

  unique(value, index, self) {
    return self.indexOf(value) === index;
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