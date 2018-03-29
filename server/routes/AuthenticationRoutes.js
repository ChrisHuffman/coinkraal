//server/routes/routes.js
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken')
var config = require('config');
const { OAuth2Client } = require('google-auth-library');
var UserRespository = require('../repository/UserRepository');

var router = express.Router();

var User = require('../models/User')
var userRespository = new UserRespository();

var generateJwt = function (user) {
    var privateKey = config.get('auth.jwtPrivateKey');
    return jwt.sign({ _id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName }, privateKey);
}

router.post('/auth/signin', function (req, res) {

    var token = req.body.token;
    var clientId = config.get('auth.googleClientId');
    var client = new OAuth2Client(clientId, '', '');

    client.verifyIdToken({ idToken: token, audiance: clientId }).then(login => {
        var payload = login.getPayload();
        var googleId = payload.sub;

         if(payload.aud != clientId)
        {
            res.status(500).send({ error: 'bad google client id' });
            return;
        }

        userRespository.getUserByGoogleId(googleId)
            .then(user => {

                //If there is no user then add one
                if (user == null) {

                    user = new User();
                    user.firstName = payload.given_name;
                    user.lastName = payload.family_name;
                    user.picture = payload.picture;
                    user.email = payload.email;
                    user.googleId = googleId;
                    user.messages = [];

                    user.save(function (err, u) {
                        if (err)
                            return res.send(err);

                        res.json({ 
                            isFirstLogin: true,
                            token: generateJwt(u) 
                        });
                    });
                }
                else {
                    res.json({ 
                        isFirstLogin: false,
                        token: generateJwt(user) 
                    });
                }
            })
            .catch((error) => {
                res.status(500).send(error);
            })
    })
    .catch((error) => {
        res.status(500).send(error);
    });
});

module.exports = router;