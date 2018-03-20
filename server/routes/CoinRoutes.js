var express = require('express');
var bodyParser = require('body-parser');
//var Cacheman = require('cacheman');

var CoinRepository = require('../repository/CoinRepository');

var router = express.Router();
var coinRepository = new CoinRepository();

//FileSystem Cache, time to live - 1 day.
//var cache = new Cacheman('coins', { ttl: 86400, engine: 'cacheman-file' });

router.get('/api/coins/:symbol/links', function (req, res) {

    coinRepository.getCoinLinks(req.params.symbol).then(
        function(links) {
            res.json(links);
        },
        function(err) {
            res.status(500).send('');
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