import { computed, observable, observe, reaction } from 'mobx';

export class Global {

    authStore = null;
    currencyStore = null;
    transactionStore = null;
    exchangeStore = null;

    @observable isLoaded = false;

    constructor(authStore, currencyStore, transactionStore, exchangeStore) {
        this.authStore = authStore;
        this.currencyStore = currencyStore;
        this.transactionStore = transactionStore;
        this.exchangeStore = exchangeStore;
    }

    loadApplicationData() {

        this.currencyStore.loadPurchaseCurrencies();
        this.currencyStore.loadCoins();
        this.exchangeStore.loadData();

        //Can only load transaction if the user is authenticated
        reaction(() => this.authStore.token, (token) => {
            if(token)
                this.transactionStore.loadTransactions();
        });

        //If they are currently authenticated then load transactions
        if(this.authStore.token)
            this.transactionStore.loadTransactions();
    }
}

export default Global;