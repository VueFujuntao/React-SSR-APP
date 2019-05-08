const path = require('path');
const webpack = require('webpack');

const config = {
  mode: 'development',
  target: 'node',
  entry: {
    app: path.join(__dirname, '../client/server-entry.js')
  },
  output: {
    path: path.join(__dirname, '../dist'),
    filename: 'server-entry.js',
    libraryTarget: 'commonjs2'
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [path.resolve(__dirname, '..', 'node_modules')],
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
    new webpack.NoEmitOnErrorsPlugin()
  ]
}

module.exports = config