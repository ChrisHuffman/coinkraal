import { computed, observable, observe, reaction, action } from 'mobx';

export class Global {

    authStore = null;
    currencyStore = null;
    coinStore = null;
    transactionStore = null;
    exchangeStore = null;

    @observable isLoaded = false;
    loadCount = 2;

    @observable selectedFiat = "USD";
    @observable selectedCoin = "BTC";

    fiatOptions = [];
    coinOptions = [];

    constructor(authStore, currencyStore, coinStore, transactionStore, exchangeStore) {
        this.authStore = authStore;
        this.currencyStore = currencyStore;
        this.coinStore = coinStore;
        this.transactionStore = transactionStore;
        this.exchangeStore = exchangeStore;

        this.loadFiatOptions();
        this.loadCoinOptions();

        this.checkLoadComplete = this.checkLoadComplete.bind(this);
    }

    loadFiatOptions() {
        this.fiatOptions.push({ symbol: 'USD', name: 'US Dollar', fullName: 'US Dollar (USD)'});
        this.fiatOptions.push({ symbol: 'ZAR', name: 'SA Rand', fullName: 'SA Rand (ZAR)'});
        this.fiatOptions.push({ symbol: 'EUR', name: 'Euro', fullName: 'Euro (EUR)'});
        this.fiatOptions.push({ symbol: 'GBP', name: 'Great British Pound', fullName: 'Great British Pound (GBP)'});
        this.fiatOptions.push({ symbol: 'AUD', name: 'Auzzie Dollar', fullName: 'Auzzie Dollar (USD)'});
    }

    loadCoinOptions() {
        this.coinOptions.push({ symbol: 'BTC', name: 'Bitcoin', fullName: 'Bitcoin (BTC)'});
        this.coinOptions.push({ symbol: 'ETH', name: 'Ethereum', fullName: 'Ethereum (ETH)'});
        this.coinOptions.push({ symbol: 'NEO', name: 'NEO', fullName: 'NEO (NEO)'});
    }

    loadApplicationData() {

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

    @computed get supportedCurrencies() {
        return this.coinOptions.concat(this.fiatOptions);
    }
}

export default Global;