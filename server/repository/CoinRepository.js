
var Coin = require('../models/Coin');

class CoinRepository {

    getCoinLinks(symbol) {

        return new Promise(function (resolve, reject) {

            Coin.findOne({ symbol: symbol.toUpperCase() })
                .select('links') 
                .exec(function (error, coin) {
                    if (error)
                        reject(error);
                    else {
                        resolve(coin.links);
                    }
                });
        })
    }

    getCoinLogo(symbol) {

        return new Promise(function (resolve, reject) {

            Coin.findOne({ symbol: symbol.toUpperCase() })
                .select('logoBase62_32x32')     
                .exec(function (error, coin) {
                    if (error)
                        reject(error);
                    else
                        resolve(coin ? coin.logoBase62_32x32 : "");
                });
        })
    }

}

module.exports = CoinRepository;