
var Transaction = require('../models/Transaction');

class TransactionRepository {

    getTransactions(userId) {

        return new Promise(function (resolve, reject) {

            Transaction.find({})
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

        return new Promise(function (resolve, reject) {

            var opts = { runValidators: true };
            Transaction.update({ _id: id }, { $set: transaction }, opts, function (err) {
                if (err)
                    reject(err);
                else
                    resolve();
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

}

module.exports = TransactionRepository;