import { computed, observable, observe, reaction, action } from 'mobx';

export class Global {

    authStore = null;
    currencyStore = null;
    coinStore = null;
    transactionStore = null;
    exchangeStore = null;
    userStore = null;

    @observable isLoaded = false;
    loadCount = 3;

    @observable selectedFiat = "";
    @observable selectedCoin = "";
    @observable profilePictureUrl = "";
    @observable isFirstLogin = false;

    @observable marketCap = 0;
    @observable btcDominace = 0;

    fiatOptions = [];
    coinOptions = [];
    purchaseTypeOptions = [];

    constructor(authStore, currencyStore, coinStore, transactionStore, exchangeStore, userStore) {
        this.authStore = authStore;
        this.currencyStore = currencyStore;
        this.coinStore = coinStore;
        this.transactionStore = transactionStore;
        this.exchangeStore = exchangeStore;
        this.userStore = userStore;

        this.loadFiatOptions();
        this.loadCoinOptions();
        this.loadPurchaseTypeOptions();
        
        this.loadGlobalData();
        
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

    loadPurchaseTypeOptions() {
        this.purchaseTypeOptions.push({ key: 'unit', name: 'Per Unit'});
        this.purchaseTypeOptions.push({ key: 'total', name: 'Total Value'});
    }

    loadUserData() {

        this.userStore.getUser()
            .then(user => {

                this.setProfilePictureUrl(user.picture);

                let settings = user.settings;
                this.setSelectedFiat(settings.find(s => s.name == 'defaultFiat').value);
                this.setSelectedCoin(settings.find(s => s.name == 'defaultCoin').value);

                this.checkLoadComplete();

                this.transactionStore.loadTransactions();
            });
    }

    loadGlobalData() {
        this.coinStore.getGlobalData()
            .then(action((data) => {
                this.marketCap = data.total_market_cap_usd;
                this.btcDominace = data.bitcoin_percentage_of_market_cap;
            }));
    }

    loadApplicationData() {

        this.coinStore.loadCoins().then(this.checkLoadComplete);
        this.exchangeStore.load(this.fiatOptions.slice(0), this.coinOptions.slice(0)).then(this.checkLoadComplete);

        //Can only load transaction if the user is authenticated
        reaction(() => this.authStore.token, (token) => {
            if(token) {
                this.loadUserData();
            }
        });

        //If they are currently authenticated then load transactions
        if(this.authStore.token) {
            this.loadUserData();
        }
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

    @action setProfilePictureUrl(url) {
        this.profilePictureUrl = url;
    }

    @action setIsFirstLogin(isFirstLogin) {
        this.isFirstLogin = isFirstLogin;
    }

    @computed get supportedCurrencies() {
        return this.coinOptions.concat(this.fiatOptions);
    }
}

export default Global;
