
var User = require('../models/User');

class UserRepository {

    getUserByGoogleId(googleId) {
        return this.getUserByFilter({ 'googleId': googleId });
    }

    getUserByFacebookId(facebookId) {
        return this.getUserByFilter({ 'facebookId': facebookId });
    }

    getUser(userId) {
        return this.getUserByFilter({ _id: userId });
    }

    getUserByFilter(filter) {

        return new Promise(function (resolve, reject) {

            User.findOne(filter)
                .exec(function (error, user) {

                    if (error) {
                        reject(error);
                        return;
                    }

                    if (!user) {
                        resolve(null);
                        return;
                    }

                    var settings = user.settings ? user.settings : [];

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

        var self = this;

        return new Promise(function (resolve, reject) {

            self.getUser(userId)
                .then(user => {
                    user.settings = newSettings;
                    user.save(function (err) {
                        if (err)
                            reject(err);
                        else
                            resolve();
                    });
                });
        });
    }

    addUser(user) {

        return new Promise(function (resolve, reject) {
            user.save(function (error, user) {
                if (error || !user) {
                    reject(error);
                    return;
                }
                resolve();
            });
        });
    }

}

module.exports = UserRepository;