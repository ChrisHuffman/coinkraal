var express = require('express');
var bodyParser = require('body-parser');
const superagent = require('superagent');

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

            var html = resp.text;

            var start = html.indexOf('.write("') + 8;
            var end = html.indexOf('");') 

            html = html.substring(start, end);
            html = html.replace(/\\/g, "");

            res.send(html);
        });
});

module.exports = router;