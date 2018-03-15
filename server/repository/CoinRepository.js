
var Coin = require('../models/Coin');

class CoinRepository {

    getCoins() {

        return new Promise(function (resolve, reject) {

            Coin.find({})
                .select('_id name symbol cmc_rank twitterUrl redditUrl')            
                .sort({ cmc_rank: 'asc' })  
                .exec(function (error, coins) {
                    if (error)
                        reject(error);
                    else
                        resolve(coins);
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