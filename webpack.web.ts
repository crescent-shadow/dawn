import path = require('path');
import webpack = require('webpack');
import merge = require('webpack-merge');
import HtmlWebpackPlugin = require('html-webpack-plugin');

import common from './webpack.common';

const web: webpack.Configuration = merge(common, {
  target: 'web',
  entry: './src/renderer/index.ts',
  output: {
    filename: 'renderer.js',
    path: path.join(__dirname, 'dist')
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Dawn',
      favicon: './src/renderer/assets/favicon.ico',
      template: 'src/renderer/index.html'
    })
  ],
  devServer: {
    contentBase: './dist'
  }
});

export default web;