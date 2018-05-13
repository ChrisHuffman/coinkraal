const defaultRoutes = require('./DefaultRoutes.js')
const authenticationRoutes = require('./AuthenticationRoutes.js')
const transactionRoutes = require('./TransactionRoutes.js')
const coinRoutes = require('./CoinRoutes.js')
const socialRoutes = require('./SocialRoutes.js')
const userRoutes = require('./UserRoutes.js')

module.exports = [
    defaultRoutes,
    authenticationRoutes,
    transactionRoutes,
    coinRoutes,
    socialRoutes,
    userRoutes
]

