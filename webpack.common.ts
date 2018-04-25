import webpack = require("webpack");

const common: webpack.Configuration = {
  node: {
    __dirname: true
  },

  devtool: 'inline-source-map',

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

export default common;