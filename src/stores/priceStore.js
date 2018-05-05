import { observable, action, computed, reaction } from 'mobx';

export class PriceStore {

    @observable priceIndex = {};
    tempPriceIndex = {};
    loadCount = 2;

    constructor(agent, transactionStore) {

        this.agent = agent;
        this.checkComplete = this.checkComplete.bind(this);

        reaction(() => transactionStore.transactions, () => {
            this.loadPriceIndex(transactionStore.transactions);
        });
    }

    @action loadPriceIndex(transactions) {

        //Clear
        this.loadCount = 2;
        this.tempPriceIndex = {}

        let coins = this.getUniqueCurrencies(transactions);

        if (coins.length == 0)
            return;

        this.loadIndex("BTC", coins.slice(), this.checkComplete)

        //PERFORMANCE: could remove this and only use the BTC one..
        this.loadIndex("USD", coins.slice(), this.checkComplete)
    }

    @action loadIndex(fromSymbol, coins, resolve) {

        let chunckSize = 5; //Max = 30 (5 * 4 + 5 = 25)
        let chunck = coins.splice(0, chunckSize);

        if (!this.tempPriceIndex[fromSymbol])
        this.tempPriceIndex[fromSymbol] = {};

        this.agent.CryptoCompare.getPrice(fromSymbol, chunck)
            .then(action((rates) => {

                this.tempPriceIndex[fromSymbol] = Object.assign(this.tempPriceIndex[fromSymbol], rates);

                if (coins.length == 0)
                    resolve();
                else
                    this.loadIndex(fromSymbol, coins, resolve)
            }));
    }

    getUniqueCurrencies(transactions) {
        let currencies = transactions.map(t => {
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
            //console.log('Loaded prices: ', this.tempPriceIndex);
            this.priceIndex = this.tempPriceIndex;
        }
    }
}

export default PriceStore;