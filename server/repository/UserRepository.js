
var User = require('../models/User');

class UserRepository {

    getUserByGoogleId(googleId) {

        console.log('querying for google user... Id:' + googleId);
        
        return new Promise(function (resolve, reject) {
          
            User.findOne({ 'googleId': googleId }, function (error, user) {
                if (error)
                    reject(error);
                else
                    resolve(user);
            });
        })
    }

}

module.exports = UserRepository;