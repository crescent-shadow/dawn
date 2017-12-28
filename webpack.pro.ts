import webpack = require('webpack');
import merge = require('webpack-merge');
import ExtractTextPlugin = require("extract-text-webpack-plugin");
import common from './webpack.common';

const config: webpack.Configuration = merge(common, {
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract([
          'css-loader', 'sass-loader'
        ]),
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('main.[chunkhash].css')
  ]
});

export default config;