var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('config');
var jwt = require('express-jwt');

var defaultRoutes = require('./routes/DefaultRoutes.js')
var authenticationRoutes = require('./routes/AuthenticationRoutes.js')
var transactionRoutes = require('./routes/TransactionRoutes.js')

var app = express();


app.set('view engine', 'ejs'); //Dont think we need this...
app.set('views', path.join(__dirname, '../dist'));
app.use(express.static(path.join(__dirname, '../dist')));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: false}));
app.use(jwt({ secret: config.get('auth.jwtPrivateKey')}).unless({path: ['/', '/auth/signin', '/favicon.ico']}));

mongoose.connect(config.get('db.connection'));

app.use('/', defaultRoutes);
app.use('/', authenticationRoutes);
app.use('/', transactionRoutes);

module.exports = app;