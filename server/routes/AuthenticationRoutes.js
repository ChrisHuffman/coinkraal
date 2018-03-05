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
    //var clientId = '438822097741-eo7be3r2pk4preadlqmblhsskvfh6jmk.apps.googleusercontent.com'; //DEV
    var clientId = '617395409011-nc7n22gtcg46nig91pe45s5on4uf9p8d.apps.googleusercontent.com'; //PROD
    var client = new OAuth2Client(clientId, '', '');

    client.verifyIdToken({ idToken: token, audiance: clientId }).then(login => {
        var payload = login.getPayload();
        var googleId = payload.sub;

        //TODO!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        //match payload.aud

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

                    user.save(function (err, u) {
                        if (err)
                            return res.send(err);

                        res.json({ token: generateJwt(u) });
                    });
                }
                else {
                    res.json({ token: generateJwt(user) });
                }
            })
            .catch((error) => {
                console.log(error);
            })
    });
});

module.exports = router;