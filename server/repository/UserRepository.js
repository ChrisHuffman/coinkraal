
var User = require('../models/User');

class UserRepository {

    getUserByGoogleId(googleId) {

        //console.log('querying for google user... Id:' + googleId);

        return new Promise(function (resolve, reject) {

            User.findOne({ 'googleId': googleId }, function (error, user) {
                if (error)
                    reject(error);
                else
                    resolve(user);
            });
        })
    }

    getUser(userId) {

        return new Promise(function (resolve, reject) {

            User.find({ userId: userId })
                .exec(function (error, user) {
                    if (error)
                        reject(error);
                    else
                        resolve(user);
                });
        })
    }

    getSettings(userId) {

        return new Promise(function (resolve, reject) {

            User.find({ userId: userId })
                .exec(function (error, user) {
                    if (error)
                        reject(error);
                    else {

                        var settings = user.settings ? user.settings : [];

                        //Set defaults IF not setting exists
                        if(!settings.find(s => s.name == 'defautFiat'))
                            settings.push({ name: "defaultFiat", value: "USD"});

                        if(!settings.find(s => s.name == 'defautCoin'))
                            settings.push({ name: "defautCoin", value: "BTC"});

                        if(!settings.find(s => s.name == 'defaultChartTimeRangeDays'))
                            settings.push({ name: "defaultChartTimeRange", value: "90"});

                        resolve(settings);
                    }
                });
        })
    }

    updateSettings(userId, newSettings) {

        var self = this;

        return new Promise(function (resolve, reject) {

            self.getUser(userId)
                .then(currentSettings => {

                    newSettings.forEach(newSetting => {

                        var currentSetting = null;

                        if (user.settings)
                            currentSetting = user.settings.find(m => m.name = name);
    
                        //Insert
                        if (!currentSetting) {
                            var setting = {
                                name: newSetting.name,
                                value: newSetting.value
                            };
                            user.settings.push(setting);
                        }
                        //Update
                        else {
                            currentSetting.value = newSetting.value;
                        }
                    });

                    //Save
                    user.save(function (err) {
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