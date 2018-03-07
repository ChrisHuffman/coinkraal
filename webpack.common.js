const webpack = require('webpack');
const path = require('path');
const config = require('config');

var apiRoot = config.get('api.root');
var googleClientId = config.get('auth.googleClientId');

console.log("Config Settings");
console.log("========================================");
console.log("Environment: " + process.env.NODE_ENV || "PROD");
console.log("API Base: " + apiRoot);
console.log("Db Connection: " + config.get('db.connection'));
console.log("Google Client Id: " + googleClientId);
console.log("========================================");

module.exports = {

  entry: "./client/index.jsx",

  output: {
    filename: "bundle.js",
    path: __dirname + "/dist",
  },

  resolve: {
    extensions: ['.js', '.jsx']
  },
  
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loaders: ["babel-loader"],
      },
      {
      test: /\.css$/,
      loader: "style-loader!css-loader"
      }
    ],
  },

  plugins: [
    new webpack.DefinePlugin({
      __API_ROOT__: JSON.stringify(apiRoot),
      __GOOGLE_CLIENT_ID__: JSON.stringify(googleClientId)
    })
  ]
  
}
