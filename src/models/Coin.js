

export class Coin {

    constructor(symbol, name) {
        this.symbol = symbol;
        this.name = name;
        this.fullName = `${this.name} (${this.symbol})`;
    }

    symbol = '';
    name = '';
    fullName = '';

    rank = 0;

    priceUsd = 0;
    volumeUsd24h = 0;
    marketCapUsd = 0;

    maxSupply = 0;
    availableSupply = 0;
    totalSupply = 0;

    percentChange1h = 0;
    percentChange24h = 0;
    percentChange7d = 0;
}

export default Coin;