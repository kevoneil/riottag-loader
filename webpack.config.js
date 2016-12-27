
const path = require('path')
const webpack = require('webpack')

module.exports = {
  target: "node",
  entry: './index.js',
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'index.js'
  },
  externals: ['riot-compiler', 'loser-utils']
}
