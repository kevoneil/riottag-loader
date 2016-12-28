
const path = require('path')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals');

module.exports = {
  target: "node",
  entry: './index.js',
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'index.js'
  },
  externals: [nodeExternals()]
}
