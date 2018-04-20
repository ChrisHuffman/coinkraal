//server/routes/routes.js
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken')
var config = require('config');
const { OAuth2Client } = require('google-auth-library');
const superagent = require('superagent');
var UserRespository = require('../repository/UserRepository');

var router = express.Router();

var User = require('../models/User')
var userRespository = new UserRespository();

var generateJwt = function (user) {
    var privateKey = config.get('auth.jwtPrivateKey');
    return jwt.sign({ _id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName }, privateKey);
}

var authenticateUser = function (res, user, userData) {
    //If there is no user then add one
    if (user == null) {

        console.log('userData: ', userData);

        user = new User();
        user.firstName = userData.firstName;
        user.lastName = userData.lastName;
        user.picture = userData.picture;
        user.email = userData.email;
        user.googleId = userData.googleId;
        user.facebookId = userData.facebookId;

        user.dateCreated = new Date();
        user.settings = [];

        console.log('adding user: ', user);

        userRespository.addUser(user)
            .then(() => {
                res.json({
                    isFirstLogin: true,
                    token: generateJwt(user)
                });
            })
            .catch((err) => {
                return res.send(err);
            });
    }
    else {
        res.json({
            isFirstLogin: false,
            token: generateJwt(user)
        });
    }
}

router.post('/auth/signin/google', function (req, res) {

    var token = req.body.token;
    var clientId = config.get('auth.googleClientId');
    var client = new OAuth2Client(clientId, '', '');

    client.verifyIdToken({ idToken: token, audiance: clientId }).then(login => {
        var payload = login.getPayload();
        var googleId = payload.sub;

        if (payload.aud != clientId) {
            res.status(500).send({ error: 'bad google client id' });
            return;
        }

        userRespository.getUserByGoogleId(googleId)
            .then(user => {

                console.log('user', user);

                var userData = {
                    firstName: payload.given_name,
                    lastName: payload.family_name,
                    picture: payload.picture,
                    email: payload.email,
                    googleId: googleId
                };

                console.log('userData', userData);

                authenticateUser(res, user, userData);
            })
            .catch((error) => {
                res.status(500).send(error);
            })
        })
        .catch((error) => {
            res.status(500).send(error);
        });
});


router.post('/auth/signin/facebook', function (req, res) {

    var accessToken = req.body.accessToken;
    var email = req.body.email;
    var facebookId = req.body.userId;
    var name = req.body.name;
    var picture = req.body.picture;

    var nameSplit = name.split(' ');
    var firstName = nameSplit[0];
    var lastName = nameSplit[1];

    var clientId = config.get('auth.facebookClientId');

    superagent.get('https://graph.facebook.com/debug_token')
        .query({ access_token: accessToken, input_token: accessToken })
        .end((err, resp) => {
            if (err) {
                res.status(500).send('');
                return;
            }

            userRespository.getUserByFacebookId(facebookId)
                .then(user => {
                    var userData = {
                        firstName: firstName,
                        lastName: lastName,
                        picture: picture,
                        email: email,
                        facebookId: facebookId
                    };
                    authenticateUser(res, user, userData);
                })
                .catch((error) => {
                    res.status(500).send(error);
                })

        });
});

module.exports = router;