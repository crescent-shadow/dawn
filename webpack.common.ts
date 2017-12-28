import path = require('path');
import webpack = require('webpack');
import HtmlWebpackPlugin = require('html-webpack-plugin');

const common: webpack.Configuration = {
  entry: './src/main.tsx',

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: 'main.[chunkhash].js'
  },

  module: {
    rules: [
      { test: /\.tsx?$/, use: "ts-loader", exclude: /node_modules/ },
      {
        test: /assets\/images\/.*\.(jpg|png|gif|jpeg)$/,
        use: 'file-loader'
      },
      {
        test: /assets\/feather\/.*\.svg$/,
        use: 'svg-inline-loader'
      },
      {
        test: /assets\/fonts\/.*\.(eot|svg|ttf|woff|woff2)$/,
        use: 'file-loader'
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: 'Dawn',
      favicon: './src/assets/favicon.ico',
      template: 'src/index.html'
    })
  ],

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json']
  }
};

export default common;