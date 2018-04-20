var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('config');
var jwt = require('express-jwt');

var defaultRoutes = require('./server/routes/DefaultRoutes.js')
var authenticationRoutes = require('./server/routes/AuthenticationRoutes.js')
var transactionRoutes = require('./server/routes/TransactionRoutes.js')
var coinRoutes = require('./server/routes/CoinRoutes.js')
var socialRoutes = require('./server/routes/SocialRoutes.js')
var userRoutes = require('./server/routes/UserRoutes.js')

var app = express();


app.set('view engine', 'ejs'); //Dont think we need this...
app.set('views', path.join(__dirname, './dist'));
app.use(express.static(path.join(__dirname, './dist')));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: false}));
app.use(jwt({ secret: config.get('auth.jwtPrivateKey')}).unless({path: ['/', '/auth/signin/google', '/auth/signin/facebook', '/api/coins/globaldata', '/favicon.ico', new RegExp('\/api\/coins\/(.*)\/logo')]}));

mongoose.connect(config.get('db.connection'));

app.use('/', defaultRoutes);
app.use('/', authenticationRoutes);
app.use('/', transactionRoutes);
app.use('/', coinRoutes);
app.use('/', socialRoutes);
app.use('/', userRoutes);

var port = process.env.PORT || 1337

app.listen(port, function() {
 console.log('running at localhost: ' + port);
});

module.exports = app;