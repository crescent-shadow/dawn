import webpack = require('webpack');
import merge = require('webpack-merge');

import common from './webpack.common';

const config: webpack.Configuration = merge(common, {
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ],
        exclude: /node_modules/
      }
    ]
  }
});

export default config;