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
  transaction.date = new Date(req.body.date);
  transaction.exchange = req.body.exchange;
  transaction.notes = req.body.notes;
  transaction.currency = req.body.currency;
  transaction.amount = req.body.amount;
  transaction.purchaseCurrency = req.body.purchaseCurrency;
  transaction.purchaseUnitPrice = req.body.purchaseUnitPrice;
  transaction.sell = [];

  transactionRepository.addTransaction(transaction)
    .then(() => res.send(""))
    .catch((error) => res.status(400).send(error));
});

router.route('/api/transactions/update').put(function (req, res) {

  var transaction = {
    date: new Date(req.body.date),
    exchange: req.body.exchange,
    notes: req.body.notes,
    currency: req.body.currency,
    amount: req.body.amount,
    purchaseCurrency: req.body.purchaseCurrency,
    purchaseUnitPrice: req.body.purchaseUnitPrice
  };

  transactionRepository.updateTransaction(req.body._id, transaction)
    .then(() => res.send(""))
    .catch((error) => res.status(400).send(error));
});

router.route('/api/transactions/remove').delete(function (req, res) {

  var id = req.query.id;
  transactionRepository.removeTransaction(id)
    .then(() => res.send(''))
    .catch((error) => res.status(500).send(''));

});

router.get('/api/transactions/:id/sales', function (req, res) {

  transactionRepository.getSales(req.params.id).then(
    function (sales) {
      res.json(sales);
    },
    function (err) {
      res.send(err);
    }
  );

});

router.route('/api/transactions/:id/sales/add').post(function (req, res) {

  var sale = {
    date: new Date(req.body.date),
    amount: req.body.amount,
    saleCurrency: req.body.saleCurrency,
    saleUnitPrice: req.body.saleUnitPrice,
    notes: req.body.notes
  };

  transactionRepository.addSale(req.params.id, sale)
    .then(() => res.send(""))
    .catch((error) => res.status(400).send(error));
});


module.exports = router;