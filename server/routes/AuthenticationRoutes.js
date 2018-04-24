//server/routes/routes.js
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken')
var config = require('config');
var { OAuth2Client } = require('google-auth-library');
var superagent = require('superagent');
var UserRespository = require('../repository/UserRepository');

var User = require('../models/User')
var userRespository = new UserRespository();

var generateJwt = function (user) {
    let privateKey = config.get('auth.jwtPrivateKey');
    return jwt.sign({ _id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName }, privateKey);
}

var authenticateUser = function (res, user, userData) {

    let insertUser = false;

    if(user == null) {

        user = new User();
        user.dateCreated = new Date();
        user.settings = [];

        insertUser = true;
    }

    user.firstName = userData.firstName;
    user.lastName = userData.lastName;
    user.picture = userData.picture;
    user.email = userData.email;
    user.googleId = userData.googleId || user.googleId;
    user.facebookId = userData.facebookId || user.facebookId;
    user.lastLogin = new Date();

    //If there is no user then add one
    if (insertUser) {

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

        userRespository.updateUser(user._id, user)
        .then(() => {
            res.json({
                isFirstLogin: false,
                token: generateJwt(user)
            });
        })
        .catch((err) => {
            return res.send(err);
        });
    }
}

router.post('/auth/signin/google', function (req, res) {

    let token = req.body.token;
    let clientId = config.get('auth.googleClientId');
    let client = new OAuth2Client(clientId, '', '');

    client.verifyIdToken({ idToken: token, audiance: clientId }).then(login => {
        let payload = login.getPayload();
        let googleId = payload.sub;

        if (payload.aud != clientId) {
            res.status(500).send({ error: 'bad google client id' });
            return;
        }

        userRespository.getUserByEmail(payload.email)
            .then(user => {

                let userData = {
                    firstName: payload.given_name,
                    lastName: payload.family_name,
                    picture: payload.picture,
                    email: payload.email,
                    googleId: googleId
                };

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

    let accessToken = req.body.accessToken;
    let email = req.body.email;
    let facebookId = req.body.userId;
    let name = req.body.name;
    let picture = req.body.picture;

    let nameSplit = name.split(' ');
    let firstName = nameSplit[0];
    let lastName = nameSplit[1];

    let clientId = config.get('auth.facebookClientId');

    superagent.get('https://graph.facebook.com/debug_token')
        .query({ access_token: accessToken, input_token: accessToken })
        .end((err, resp) => {
            if (err) {
                res.status(500).send('');
                return;
            }

            userRespository.getUserByEmail(email)
                .then(user => {
                    let userData = {
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