import { observable, action, computed } from 'mobx';
import agent from '../agent';

export class TransactionStore {

  @observable isLoading = false;
  @observable transactions = observable([]);

  constructor() {
    
  }

  @action loadTransactions() {
    this.isLoading = true;
    return agent.Transactions.getTransactions()
      .then(action((transactions) => {
        this.transactions.replace(transactions);
      }))
      .finally(action(() => { this.isLoading = false; }));
  }

  addTransaction(transaction) {
    return agent.Transactions.add(transaction)
      .then(action(() => {
        this.loadTransactions();
      }));
  }

  removeTransaction(id) {
    return agent.Transactions.remove(id)
      .then(action(() => {
        this.loadTransactions();
      }));
  }
}

export default new TransactionStore();