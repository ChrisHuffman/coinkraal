var express = require('express');
var bodyParser = require('body-parser');
var superagent = require('superagent');
var Cacheman = require('cacheman');

var CoinRepository = require('../repository/CoinRepository');

var router = express.Router();
var coinRepository = new CoinRepository();

//FileSystem Cache, time to live - 1 day.
var cache = new Cacheman('coins', { ttl: 86400, engine: 'cacheman-file' });

var writeImageToResponse = function(logo, res) {
    var img = new Buffer(logo, 'base64');
    res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': img.length,
        'Cache-Control': 'public, max-age=604800' //1 week
    });
    res.end(img);
}

router.get('/api/coins/:symbol/links', function (req, res) {

    coinRepository.getCoinLinks(req.params.symbol).then(
        function (links) {
            res.json(links);
        },
        function (err) {
            res.status(500).send('');
        }
    );

});

router.get('/api/coins/:symbol/logo', function (req, res) {

    let cachePath = `/api/coins/${req.params.symbol}/logo`;

    cache.get(cachePath, function (err, value) {

        if (err) {
            res.status(500).send('');
            return;
        };

        if (!value) {

            coinRepository.getCoinLogo(req.params.symbol).then(
                function (logo) {
                    writeImageToResponse(logo, res);
                    cache.set(cachePath, logo);
                },
                function (err) {
                    res.send(err);
                }
            );
        }
        else {
            writeImageToResponse(value, res);
        }
    });
});

router.get('/api/coins/globaldata', function (req, res) {

    superagent.get('https://api.coinmarketcap.com/v1/global')
        .end((err, resp) => {
            if (err) {
                res.status(500).send('');
                return;
            }
            res.json(JSON.parse(resp.text));
        });
});


module.exports = router;