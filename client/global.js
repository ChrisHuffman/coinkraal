import { computed, observable, observe, reaction, action } from 'mobx';

export class Global {

    authStore = null;
    currencyStore = null;
    transactionStore = null;
    exchangeStore = null;

    @observable isLoaded = false;
    loadCount = 3;

    constructor(authStore, currencyStore, transactionStore, exchangeStore) {
        this.authStore = authStore;
        this.currencyStore = currencyStore;
        this.transactionStore = transactionStore;
        this.exchangeStore = exchangeStore;

        this.checkLoadComplete = this.checkLoadComplete.bind(this);
    }

    loadApplicationData() {

        this.currencyStore.loadPurchaseCurrencies().then(this.checkLoadComplete);
        this.currencyStore.loadCoins().then(this.checkLoadComplete);
        this.exchangeStore.loadData().then(this.checkLoadComplete);

        //Can only load transaction if the user is authenticated
        reaction(() => this.authStore.token, (token) => {
            if(token)
                this.transactionStore.loadTransactions();
        });

        //If they are currently authenticated then load transactions
        if(this.authStore.token)
            this.transactionStore.loadTransactions();
    }

    @action checkLoadComplete() {
        this.loadCount--;

        if(this.loadCount == 0)
            this.isLoaded = true;
    }
}

export default Global;