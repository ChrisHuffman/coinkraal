const webpack = require('webpack');
const path = require('path');

var apiHost;
var googleClientId;

var setupAPI = function() {
  switch(process.env.NODE_ENV) {
    case 'DEV': 
      apiHost = JSON.stringify("http://localhost:1337");
      googleClientId = JSON.stringify("438822097741-eo7be3r2pk4preadlqmblhsskvfh6jmk.apps.googleusercontent.com");
      break;
    default:
      apiHost = JSON.stringify("https://coinkraal.azurewebsites.net");
      googleClientId = JSON.stringify("617395409011-nc7n22gtcg46nig91pe45s5on4uf9p8d.apps.googleusercontent.com");
      break;
  }
}

setupAPI();

console.log("ENV");
console.log(process.env.NODE_ENV);
console.log(apiHost);
console.log(googleClientId);

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
      __API_ROOT__: apiHost,
      __GOOGLE_CLIENT_ID__: googleClientId
    })
  ]
  
}
