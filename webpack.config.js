const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const isProd = process.env.NODE_ENV === 'production'
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const ExtractTextPlugin = require("extract-text-webpack-plugin")

module.exports = {
  entry: ['babel-polyfill', './src/main.js'],
  output: {
    path: path.resolve(
      __dirname,
      isProd ? '' : '../lab-wiki-backend',
      'static'
    ),
    publicPath: '',
    filename: 'build.js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
          }
          // other vue-loader options go here
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg|otf|eot|ttf|woff|woff2)($|\?)/,
        loader: 'file-loader',
        options: {
          objectAssign: 'Object.assign'
        }
      },
      {
        test: /\.csv$/,
        loader: 'raw-loader'
      },
      {
        test: /\.styl$/,
        loader: ExtractTextPlugin.extract({
          use: ['css-loader', 'stylus-loader']
        })
      },
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      'public': path.resolve(__dirname, './public')
    },
    modules: ['src', 'node_modules']
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    port: 12345
  },
  performance: {
    hints: false
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        WIKI_HOME: JSON.stringify(process.env.WIKI_HOME)
      }
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.ejs'),
      inject: false,
      base: process.env.WIKI_HOME
    }),
    new ExtractTextPlugin('style.css')
  ],
  devtool: '#eval-source-map'
}

if (isProd) {
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: true
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    new BundleAnalyzerPlugin()
  ])
}
