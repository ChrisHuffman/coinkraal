
export class PortfolioChartServiceDataPoint {

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
        this.amounts[transaction.currency] += transaction.amount;
    }

    addSale = function(currency, sale) {
        this.amounts[currency] -= sale.amount;
    }

    getTotal = function() {

        let total = 0;
        for (let currency in this.prices) {
            if (this.prices.hasOwnProperty(currency)) {
                total += this.prices[currency] * this.amounts[currency];
            }
        }
        return total;
        
    }
}

export default PortfolioChartServiceDataPoint;

