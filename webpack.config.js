const path = require('path')
const Dotenv = require('dotenv-webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: {
    main: './src/index.js',
    currency: './src/Task01_FreeCurrencyAPI/currencyApi.js',
    poke: './src/Task02_PokeAPI/pokeApi.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    publicPath: '/'
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'index.html'
    }),
    new HtmlWebpackPlugin({
      template: './src/currency.html',
      filename: 'currency.html'
    }),
    new HtmlWebpackPlugin({
      template: './src/poke.html',
      filename: 'poke.html'
    }),
    new Dotenv()
  ],
  devServer: {
    proxy: {
      '/api': {
        target: 'https://api.currencyapi.com',
        changeOrigin: true,
        pathRewrite: { '^/api': '/v3' }
      }
    },
    hot: false
  }
}
