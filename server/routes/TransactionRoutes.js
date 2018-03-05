var express = require('express');
var bodyParser = require('body-parser');

var Transaction = require('../models/Transaction')
var TransactionRepository = require('../repository/TransactionRepository');

var router = express.Router();
var transactionRepository = new TransactionRepository();

router.get('/api/transactions', function (req, res) {

  transactionRepository.getTransactions(1).then(
    function (transactions) {
      res.json(transactions);
    },
    function (err) {
      res.send(err);
    }
  );

});

router.route('/api/transactions/add').post(function (req, res) {

  var transaction = new Transaction();
  transaction.userId = 1; //get from login in user
  transaction.type = req.body.type;
  transaction.in_currency = req.body.in_currency;
  transaction.in_amount = req.body.in_amount;
  transaction.in_unitPriceUSD = req.body.in_unitPriceUSD;
  transaction.out_currency = req.body.out_currency;
  transaction.out_amount = req.body.out_amount;
  transaction.out_unitPriceUSD = req.body.out_unitPriceUSD;
  transaction.date = new Date(req.body.date);
  transaction.exchange = req.body.exchange;
  transaction.notes = req.body.notes;

  transactionRepository.addTransaction(transaction)
    .then(() => res.send(""))
    .catch((error) => res.status(500).send(''));
})

router.route('/api/transactions/update').post(function (req, res) {
  // const balance = {
  //   cointicker: req.body.cointicker,
  //   balance: req.body.balance
  // };

  // Transactionsupdate({ _id: req.body._id }, balance, function (err, result) {
  //   if (err)
  //     res.send(err);
  //   res.send('Transaction successfully updated!');
  // });
});

router.route('/api/transactions/remove').delete(function (req, res) {
  var id = req.query.id;
  transactionRepository.removeTransaction(id)
    .then(() => res.send(''))
    .catch((error) => res.status(500).send(''));
});


module.exports = router;