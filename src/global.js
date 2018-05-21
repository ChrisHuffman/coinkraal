import { computed, observable, observe, reaction, action } from 'mobx';

export class Global {

    @observable loadingCoins = false;
    @observable loadingExchanges = false;
    @observable loadingUserData = false;

    @observable selectedFiat = "USD";
    @observable selectedCoin = "BTC";
    @observable profilePictureUrl = "";
    @observable isFirstLogin = false;

    @observable marketCap = 0;
    @observable btcDominace = 0;

    fiatOptions = [];
    coinOptions = [];
    purchaseTypeOptions = [];

    constructor(tokenStore, coinStore, transactionStore, exchangeStore, userStore) {
        this.tokenStore = tokenStore;
        this.coinStore = coinStore;
        this.transactionStore = transactionStore;
        this.exchangeStore = exchangeStore;
        this.userStore = userStore;

        this.loadFiatOptions();
        this.loadCoinOptions();
        this.loadPurchaseTypeOptions();
        
        this.loadGlobalData();
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

    @action
    loadUserData() {

        this.loadingUserData = true;

        this.userStore.getUser()
            .then(action((user) => {

                this.setProfilePictureUrl(user.picture);

                let settings = user.settings;
                this.setSelectedFiat(settings.find(s => s.name == 'defaultFiat').value);
                this.setSelectedCoin(settings.find(s => s.name == 'defaultCoin').value);

                this.loadingUserData = false;

                this.transactionStore.loadTransactions();
            }));
    }

    loadGlobalData() {
        this.coinStore.getGlobalData()
            .then(action((data) => {
                this.marketCap = data.total_market_cap_usd;
                this.btcDominace = data.bitcoin_percentage_of_market_cap;
            }));
    }

    @action
    loadApplicationData() {

        this.loadingCoins = true;
        this.coinStore.loadCoins().then(action(() => {
            this.loadingCoins = false;
        }));

        this.loadingExchanges = true;
        this.exchangeStore.load(this.fiatOptions.slice(0), this.coinOptions.slice(0)).then(action(() => {
            this.loadingExchanges = false;
        }));

        //Can only load transaction if the user is authenticated
        reaction(() => this.tokenStore.token, (token) => {
            if(token) {
                this.loadUserData();
            }
        });

        //If they are currently authenticated then load transactions
        if(this.tokenStore.token) {
            this.loadUserData();
        }
    }

    @computed get isLoading() {
        return this.loadingCoins || this.loadingExchanges || this.loadingUserData;
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
