
let User = require('../models/User');

class UserRepository {

    getUserByGoogleId(googleId) {
        return this.getUserByFilter({ 'googleId': googleId });
    }

    getUserByFacebookId(facebookId) {
        return this.getUserByFilter({ 'facebookId': facebookId });
    }

    getUserByEmail(email) {
        return this.getUserByFilter({ 'email': email });
    }

    getUser(userId) {
        return this.getUserByFilter({ _id: userId });
    }

    getUserByFilter(filter) {

        return new Promise((resolve, reject) => {

            User.findOne(filter)
                .exec((error, user) => {

                    if (error) {
                        reject(error);
                        return;
                    }

                    if (!user) {
                        resolve(null);
                        return;
                    }

                    let settings = user.settings ? user.settings : [];

                    //Set defaults IF not setting exists
                    if (!settings.find(s => s.name == 'defautFiat'))
                        settings.push({ name: "defaultFiat", value: "USD" });

                    if (!settings.find(s => s.name == 'defaultCoin'))
                        settings.push({ name: "defaultCoin", value: "BTC" });

                    user.settings = settings;

                    resolve(user);
                });
        })
    }

    updateSettings(userId, newSettings) {

        return new Promise((resolve, reject) => {

            this.getUser(userId)
                .then(user => {
                    user.settings = newSettings;
                    user.save(err => {
                        if (err)
                            reject(err);
                        else
                            resolve();
                    });
                });
        });
    }

    addUser(user) {

        return new Promise((resolve, reject) => {
            user.save((error, user) => {
                if (error || !user) {
                    reject(error);
                    return;
                }
                resolve();
            });
        });
    }

    updateUser(id, user) {

        return new Promise((resolve, reject) => {

            this.getUser(id)
                .then(toUpdate => {

                    toUpdate.firstName = user.firstName;
                    toUpdate.lastName = user.lastName;
                    toUpdate.picture = user.picture;
                    toUpdate.email = user.email;
                    toUpdate.googleId = user.googleId;
                    toUpdate.facebookId = user.facebookId;
                    toUpdate.lastLogin = user.lastLogin;

                    toUpdate.save(function (err) {
                        if (err)
                            reject(err);
                        else
                            resolve();
                    });

                });
        });
    }

}

module.exports = UserRepository;