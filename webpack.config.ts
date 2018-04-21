import path = require('path');
import webpack = require('webpack');
import merge = require('webpack-merge');
import HtmlWebpackPlugin = require('html-webpack-plugin');

const common: webpack.Configuration = {
  node: {
    __dirname: true
  },

  devtool: 'source-map',

  mode: 'development',

  module: {
    rules: [
      { test: /\.tsx?$/, use: "ts-loader", exclude: /node_modules/ },
      { test: /\.(mp3|ogg)$/, use: 'file-loader' },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ],
        exclude: /node_modules/
      },
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

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json']
  }
};
const main: webpack.Configuration = merge(common, {
  target: 'electron-main',
  entry: { main: './src/main/index.ts' },
  output: {
    filename: 'index.js',
    path: path.join(__dirname, './dist')
  }
});
const renderer: webpack.Configuration = merge(common, {
  target: 'electron-renderer',
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
});
const config = [main, renderer];

export default config;