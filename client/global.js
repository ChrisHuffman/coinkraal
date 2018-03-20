import { computed, observable, observe, reaction, action } from 'mobx';

export class Global {

    authStore = null;
    currencyStore = null;
    coinStore = null;
    transactionStore = null;
    exchangeStore = null;

    @observable isLoaded = false;
    loadCount = 3;

    @observable selectedFiat = "USD";
    @observable selectedCoin = "BTC";

    fiatOptions = ['USD', 'ZAR', 'GBP', 'AUD'];
    coinOptions = ['BTC', 'ETH', 'NEO'];

    constructor(authStore, currencyStore, coinStore, transactionStore, exchangeStore) {
        this.authStore = authStore;
        this.currencyStore = currencyStore;
        this.coinStore = coinStore;
        this.transactionStore = transactionStore;
        this.exchangeStore = exchangeStore;

        this.checkLoadComplete = this.checkLoadComplete.bind(this);
    }

    loadApplicationData() {

        this.currencyStore.loadPurchaseCurrencies().then(this.checkLoadComplete);
        this.coinStore.loadCoins().then(this.checkLoadComplete);
        this.exchangeStore.load(this.fiatOptions.slice(0), this.coinOptions.slice(0)).then(this.checkLoadComplete);

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

    @action setSelectedFiat(currency) {
        this.selectedFiat = currency;
    }

    @action setSelectedCoin(coin) {
        this.selectedCoin = coin;
    }
}

export default Global;