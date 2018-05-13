const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('config');
const { graphqlExpress, graphiqlExpress  } = require('apollo-server-express');
const routes = require('./server/routes/index')
const auth = require('./server/authentication')
const graphQLSchema = require('./server/graphql/schema')

//Mongo setup
mongoose.connect(config.get('db.connection'));

const app = express();

//Default express setup
app.use(express.static(path.join(__dirname, './dist')));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: false}));

//Auth setup
app.use(auth);

//GraphQL setup
app.use('/graphql', bodyParser.json(), graphqlExpress({ endpointURL: '/graphql', schema: graphQLSchema }));
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

//Server routes
app.use('/', routes);

const port = process.env.PORT || 1337

app.listen(port, function() {
 console.log('CoinKraal server running, port: ' + port);
});

module.exports = app;