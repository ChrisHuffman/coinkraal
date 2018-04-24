var express = require('express');
var bodyParser = require('body-parser');
var superagent = require('superagent');

var router = express.Router();

router.get('/api/social/reddit', function (req, res) {

    superagent.get(req.query.url + '.embed')
        .query({ limit: '9' })
        .end((err, resp) => {
            if (err) { 
                res.status(500).send('');
                return; 
            }
            
            res.setHeader('content-type', 'text/plain');

            let html = resp.text;

            let start = html.indexOf('.write("') + 8;
            let end = html.indexOf('");') 

            html = html.substring(start, end);
            html = html.replace(/\\/g, "");

            res.send(html);
        });
});

module.exports = router;