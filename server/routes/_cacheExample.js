var express = require('express');
var bodyParser = require('body-parser');
var Cacheman = require('cacheman');

var Coin = require('../models/Coin')
var CoinRepository = require('../repository/CoinRepository');

var router = express.Router();
var coinRepository = new CoinRepository();

//FileSystem Cache, time to live - 1 day.
var cache = new Cacheman('coins', { ttl: 86400, engine: 'cacheman-file' });

router.get('/api/coins', function (req, res) {


    cache.get('/api/coins', function (err, value) {

        if (err) {
            res.status(500).send('');
            return;
        };

        if (!value) {
            coinRepository.getCoins().then(

                function (coins) {
                    cache.set('/api/coins', coins, function (err, value) {
                        if (err) {
                            res.status(500).send('');
                            return;
                        };
                        res.json(value);
                    });
                },
                function (err) {
                    res.status(500).send('');
                }

            );
        }
        else {
            res.json(value);
        }
    });
});

router.get('/api/coins/:symbol/logo', function (req, res) {

    coinRepository.getCoinLogo(req.params.symbol).then(
        function (logo) {

            var img = new Buffer(logo, 'base64');
            res.writeHead(200, {
                'Content-Type': 'image/png',
                'Content-Length': img.length,
                'Cache-Control': 'public, max-age=604800' //1 week
            });
            res.end(img);

        },
        function (err) {
            res.send(err);
        }
    );

});


module.exports = router;