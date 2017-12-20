const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const extractSass = new ExtractTextPlugin({
  filename: "[name].[contenthash].css",
  disable: process.env.NODE_ENV !== "production"
});

module.exports = {
  entry: './src/main.ts',

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js"
  },

  devtool: 'source-map',

  module: {
    rules: [
      { test: /\.ts$/, use: "ts-loader" },
      {
        test: /\.scss$/,
        use: extractSass.extract({
          use: ['css-loader', 'sass-loader'],
          fallback: 'style-loader'
        })
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: 'Dawn',
      favicon: './src/assets/favicon.ico'
    }),
    extractSass
  ],

  resolve: {
    extensions: ['.ts', '.js', '.json']
  }
};