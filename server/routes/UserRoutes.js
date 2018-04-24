//server/routes/routes.js
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var UserRespository = require('../repository/UserRepository');

var User = require('../models/User')
var userRespository = new UserRespository();

router.get('/api/user', function (req, res) {

    userRespository.getUser(req.user._id)
        .then((user) => {
            res.json(user);
        })
        .catch((error) => {
            res.status(500).send(error);
        })

});

router.post('/api/user/settings', function (req, res) {

    userRespository.updateSettings(req.user._id, req.body)
        .then(() => {
            res.json();
        })
        .catch((error) => {
            res.status(500).send(error);
        })

});


module.exports = router;