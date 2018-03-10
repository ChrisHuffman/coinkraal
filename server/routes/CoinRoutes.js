var express = require('express');
var bodyParser = require('body-parser');

var Coin = require('../models/Coin')
var CoinRepository = require('../repository/CoinRepository');

var router = express.Router();
var coinRepository = new CoinRepository();

router.get('/api/coins', function (req, res) {

    coinRepository.getCoins().then(
        function (coins) {
            res.json(coins);
        },
        function (err) {
            res.send(err);
        }
    );

});

router.get('/api/coins/:symbol/logo', function (req, res) {

    coinRepository.getCoinLogo(req.params.symbol).then(
        function (logo) {

            var img = new Buffer(logo, 'base64');
            res.writeHead(200, {
                'Content-Type': 'image/png',
                'Content-Length': img.length,
                'Cache-Control': 'public, max-age=31557600' //1 year
            });
            res.end(img);

        },
        function (err) {
            res.send(err);
        }
    );

});


module.exports = router;