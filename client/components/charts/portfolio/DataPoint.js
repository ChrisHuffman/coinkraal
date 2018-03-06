
export class DataPoint {

    date = null;

    amounts = { };
    prices = { };

    constructor(date) {
        this.date = date;
        this.setStartingAmount = this.setStartingAmount.bind(this);
        this.addTransaction = this.addTransaction.bind(this);
    }

    setStartingAmount = function(currency, value) {
        this.amounts[currency] = value;
    }

    setPrice = function(currency, price) {
        this.prices[currency] = price;
    }

    addTransaction = function(transaction) {
        this.amounts[transaction.in_currency] += transaction.in_amount;
    }

    getTotal = function() {

        var total = 0;
        for (var currency in this.prices) {
            if (this.prices.hasOwnProperty(currency)) {
                total += this.prices[currency] * this.amounts[currency];
            }
        }
        return total;
        
    }
}

export default DataPoint;

