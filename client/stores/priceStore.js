import { observable, action, computed, observe } from 'mobx';
import agentExt from '../agent-ext';

export class PriceStore {

    @observable priceIndex = {};
    tempPriceIndex = {};
    loadCount = 2;

    constructor(transactionStore) {

        this.checkComplete = this.checkComplete.bind(this);

        observe(transactionStore.transactions, () => {
            this.loadPriceIndex(transactionStore.transactions);
        });
    }

    @action loadPriceIndex(transactions) {

        //Clear
        this.loadCount = 2;
        this.tempPriceIndex = {}

        var coins = this.getUniqueInCurrencies(transactions);

        if (coins.length == 0)
            return;

        this.loadIndex("BTC", coins.slice(), this.checkComplete)
        this.loadIndex("USD", coins.slice(), this.checkComplete)
    }

    @action loadIndex(fromSymbol, coins, resolve) {

        var self = this;

        var chunckSize = 5; //Max = 30 (5 * 4 + 5 = 25)
        var chunck = coins.splice(0, chunckSize);

        if (!self.tempPriceIndex[fromSymbol])
            self.tempPriceIndex[fromSymbol] = {};

        agentExt.External.getPrice(fromSymbol, chunck)
            .then(action((rates) => {

                self.tempPriceIndex[fromSymbol] = Object.assign(self.tempPriceIndex[fromSymbol], rates);

                if (coins.length == 0)
                    resolve();
                else
                    self.loadIndex(fromSymbol, coins, resolve)
            }));
    }

    getUniqueInCurrencies(transactions) {
        var currencies = transactions.map(t => {
            return t.currency;
        })
        return currencies.filter(this.unique);
    }

    unique(value, index, self) {
        return self.indexOf(value) === index;
    }

    checkComplete() {
        this.loadCount--;
        if (this.loadCount == 0) {
            console.log('Loaded prices: ', this.tempPriceIndex);
            this.priceIndex = this.tempPriceIndex;
        }
    }
}

export default PriceStore;