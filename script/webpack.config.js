const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const isDev = process.env.NODE_ENV === 'development';

const config = {
  mode: 'development',
  target: 'web',
  entry: {
    app: [
      path.join(__dirname, '../client/client-entry.js')
    ]
  },
  output: {
    filename: '[name].[hash].js',
    path: path.join(__dirname, '../dist'),
    publicPath: './public/'
  },
  module: {
    rules: [
      {
        test: /.js|jsx$/,
        loader: "babel-loader",
        exclude: [
          path.join(__dirname, '../node_modules')
        ]
      }
    ]
  },
  plugins: [
    // 本地開發渲染html模板
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '../public/index.html'),
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeEmptyAttributes: true
      }
    }),
    // 服務端渲染html模板
    new HtmlWebpackPlugin({
      template: '!!ejs-compiled-loader!' + path.join(__dirname, '../public/server.index.ejs'),
      filename: 'server.ejs',
      inject: true,
      minify: {
        collapseWhitespace: true,
        removeEmptyAttributes: true,
        removeComments: true
      }
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
}

if (isDev) {
  config.devServer = {
    host: '0.0.0.0',
    port: 8888,
    hot: true,
    overlay: {
      errors: true
    },
    publicPath: '/public/',
    historyApiFallback: {
      index: '/public/index.html'
    },
    // proxy: {
    //   '/api': 'http://localhost:3000'
    // }
  }
}

module.exports = config