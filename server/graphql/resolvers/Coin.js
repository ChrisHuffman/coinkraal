let Coin = require('../../models/Coin');

const resolvers = {
    coins: () => {
        return Coin.find();
      }
  };
  
module.exports = resolvers;