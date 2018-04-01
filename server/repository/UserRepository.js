
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

            User.findOne({ _id: userId })
                .exec(function (error, user) {
                    if (error)
                        reject(error);
                    else {

                        if(!user) {
                            reject();
                            return;
                        }

                        var settings = user.settings ? user.settings : [];

                        //Set defaults IF not setting exists
                        if(!settings.find(s => s.name == 'defautFiat'))
                            settings.push({ name: "defaultFiat", value: "USD"});

                        if(!settings.find(s => s.name == 'defaultCoin'))
                            settings.push({ name: "defaultCoin", value: "BTC"});

                        if(!settings.find(s => s.name == 'defaultChartTimeRangeDays'))
                            settings.push({ name: "defaultChartTimeRangeDays", value: "90"});

                        user.settings = settings;

                        resolve(user);
                    }
                });
        })
    }

    updateSettings(userId, newSettings) {

        var self = this;

        return new Promise(function (resolve, reject) {

            self.getUser(userId)
                .then(user => {

                    if(!user.settings)
                        user.settings = [];

                    var currentSetting = user.settings;

                    newSettings.forEach(newSetting => {

                        currentSetting = user.settings.find(m => m.name == newSetting.name);
    
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