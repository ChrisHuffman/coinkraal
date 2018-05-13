const config = require('config');
const jwt = require('express-jwt');

const secret = {
    secret: config.get('auth.jwtPrivateKey')
}

const path = [
    '/', 
    '/favicon.ico', 
    '/auth/signin/google', 
    '/auth/signin/facebook', 
    '/api/coins/globaldata', 
    new RegExp('\/api\/coins\/(.*)\/logo')
];

if(process.env.NODE_ENV === "DEV") {
    path.push('/graphiql');
    path.push('/graphql'); //take out later when passing tokens thru
}

const auth = jwt(secret).unless({ path })

module.exports = auth;