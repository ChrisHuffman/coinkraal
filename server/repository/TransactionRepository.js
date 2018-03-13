
var Transaction = require('../models/Transaction');

class TransactionRepository {

    getTransaction(transactionId) {

        return new Promise(function (resolve, reject) {

            Transaction.findOne({ _id: transactionId },
                function (error, transaction) {
                    if (error)
                        reject(error);
                    else
                        resolve(transaction);
                });
        })
    }

    getTransactions(userId) {

        return new Promise(function (resolve, reject) {

            Transaction.find({ userId: userId })
                .sort({ date: 'asc' })
                .exec(function (error, transactions) {
                    if (error)
                        reject(error);
                    else
                        resolve(transactions);
                });
        })
    }

    addTransaction(transaction) {

        return new Promise(function (resolve, reject) {

            transaction.save(function (err) {
                if (err)
                    reject(err);
                else
                    resolve();
            });
        });
    }

    updateTransaction(id, transaction) {

        var self = this;

        return new Promise(function (resolve, reject) {

            self.getTransaction(id)
                .then(toUpdate => {

                    toUpdate.date = transaction.date;
                    toUpdate.exchange = transaction.exchange;
                    toUpdate.notes = transaction.notes;
                    toUpdate.currency = transaction.currency;
                    toUpdate.amount = transaction.amount;
                    toUpdate.purchaseCurrency = transaction.purchaseCurrency;
                    toUpdate.purchaseUnitPrice = transaction.purchaseUnitPrice;

                    toUpdate.save(function (err) {
                        if (err)
                            reject(err);
                        else
                            resolve();
                    });

                });
        });
    }

    removeTransaction(transactionId) {

        return new Promise(function (resolve, reject) {

            Transaction.find({ _id: transactionId }).remove().exec(function (err, transaction) {
                if (err)
                    reject(err);
                else
                    resolve();
            })
        });
    }

    addSale(transactionId, sale) {

        var self = this;

        return new Promise(function (resolve, reject) {

            self.getTransaction(transactionId)
                .then(transaction => {

                    transaction.sales.push(sale);

                    transaction.save(function (err) {
                        if (err)
                            reject(err);
                        else
                            resolve();
                    });

                })
        });
    }

    updateSale(transactionId, sale) {

        var self = this;

        return new Promise(function (resolve, reject) {

            self.getTransaction(transactionId)
                .then(transaction => {

                    var toUpdate = transaction.sales.id(sale._id);
                    toUpdate.date = sale.date;
                    toUpdate.amount = sale.amount;
                    toUpdate.saleCurrency = sale.saleCurrency;
                    toUpdate.saleUnitPrice = sale.saleUnitPrice;
                    toUpdate.notes = sale.notes;

                    transaction.save(function (err) {
                        if (err)
                            reject(err);
                        else
                            resolve();
                    });

                })
        });
    }

    removeSale(saleId) {

        return new Promise(function (resolve, reject) {

            Transaction.findOne({ 'sales._id': saleId }, function (err, transaction) {
                if (err)
                    reject(err);
                else {
                    transaction.sales.id(saleId).remove()
                    transaction.save();
                    resolve();
                }
            })
        });
    }

}

module.exports = TransactionRepository;