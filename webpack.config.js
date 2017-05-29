const fs = require('fs');
const prod = fs.existsSync('env.prod');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const css_loader_dev = [
  { loader: 'style-loader' },
  { loader: 'css-loader' },
  { loader: 'postcss-loader' }
];

const less_loader_use = [
  {
    loader: 'style-loader',
    options: { sourceMap: true }
  },
  {
    loader: 'css-loader',
    options: { sourceMap: true }
  },
  {
    loader: 'postcss-loader',
    options: { sourceMap: true }
  },
  {
    loader: 'less-loader',
    options: {
      sourceMap: true
    }
  }
];

const css_loader_prod = ExtractTextPlugin.extract([
  'css-loader',
  'postcss-loader'
]);

const import_options = [
  // {
  //   libraryName: 'antd',
  //   style: true,
  //   css: true
  // }
];

const plugins = [];

const css_loader_use = prod ? css_loader_prod : css_loader_dev;

if (prod) {
  plugins.push(new ExtractTextPlugin('styles.css'));
}

module.exports = {
  context: path.resolve(__dirname, 'app'),
  entry: './index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'pubilc'),
    publicPath: '/'
  },
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    compress: true,
    //外网访问
    disableHostCheck: true
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: css_loader_use
      },
      {
        test: /\.less$/,
        use: less_loader_use
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'eslint-loader',
        options: {}
      },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['es2015', 'stage-1', 'react'],
            plugins: [
              'transform-runtime',
              'transform-class-properties',
              'transform-react-jsx',
              ['import', import_options]
            ]
          }
        }
      }
    ]
  },
  resolve: {
    alias: {
      styles: path.resolve(__dirname, 'app/css')
    }
  },
  plugins: plugins
};
