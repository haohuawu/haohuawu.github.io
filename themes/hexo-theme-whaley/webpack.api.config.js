const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.config')

module.exports = merge(baseWebpackConfig, {
  entry: 'src/api.js',
  output: {
    path: path.resolve(__dirname, 'source/assets/api')
  }
})
