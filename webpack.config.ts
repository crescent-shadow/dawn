import path = require('path');
import webpack = require('webpack');
import merge = require('webpack-merge');
import HtmlWebpackPlugin = require('html-webpack-plugin');

import common from './webpack.common';

const main: webpack.Configuration = merge(common, {
  context: path.resolve(__dirname, '.'),
  node: {
    __dirname: false
  },
  target: 'electron-main',
  entry: { main: './src/main/index.ts' },
  output: {
    filename: 'index.js',
    path: path.join(__dirname, 'build')
  }
});

const renderer: webpack.Configuration = merge(common, {
  target: 'electron-renderer',
  entry: './src/renderer/index.ts',
  output: {
    filename: 'renderer.js',
    path: path.join(__dirname, 'build')
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Dawn',
      favicon: './src/renderer/assets/favicon.ico',
      template: 'src/renderer/index.html'
    })
  ]
});
const config = [main, renderer];

export default config;
