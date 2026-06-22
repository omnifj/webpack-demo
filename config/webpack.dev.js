const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const ESLintPlugin = require('eslint-webpack-plugin'); // ✅ 必须加

module.exports = merge(common, {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  devServer: {
    hot: true,
    open: true,
    port: 3000,
  },
  plugins: [
    new ESLintPlugin({
      extensions: ['js', 'jsx'],
      context: 'src',
      failOnError: false,
    }),
  ],
});
