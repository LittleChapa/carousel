const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const Dotenv = require("dotenv-webpack");

module.exports = {
  entry: {
    style: path.resolve(__dirname, 'public', 'styles', 'style.css'),
    script: path.resolve(__dirname, 'src', 'scripts', 'script.js'),
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: "scripts/[name].[contenthash].js",
    assetModuleFilename: "images/[name][contenthash][ext]",
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [ MiniCssExtractPlugin.loader, 'css-loader' ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "public", "index.html"),
      filename: "index.html",
      chunks: ["script", "style"],
      chunkFilename: ["index.html"],
      minify: {
        processImages: true,
      },
    }),
    new MiniCssExtractPlugin({
      filename: "css/[name].[contenthash:8].css",
    }),
    new Dotenv()
  ],
  devServer: {
    static: path.join(__dirname, 'build'),
    port: 8080,
    open: true
  },
};