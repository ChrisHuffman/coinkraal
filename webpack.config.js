const path = require('path');

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
  }
}