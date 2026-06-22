// 引入 Node.js 内置 path 模块，用于处理文件路径
const path = require('path');

// 引入 HtmlWebpackPlugin
// 作用：根据模板自动生成 HTML，并把打包后的 JS / CSS 自动注入
const HtmlWebpackPlugin = require('html-webpack-plugin');

// Webpack 配置入口
module.exports = {

  /**
   * 入口文件（Entry Point）
   * Webpack 从这里开始构建依赖图
   */
  entry: './src/index.js',

  /**
   * 输出配置（Output）
   */
  output: {

    /**
     * 输出的 JS 文件名
     * [contenthash]：文件内容变化时 hash 才会变（利于浏览器缓存）
     */
    filename: 'bundle.[contenthash].js',

    /**
     * 输出目录
     * __dirname：当前文件所在目录
     * .. 回到项目根目录，再进入 dist
     */
    path: path.resolve(__dirname, '..', 'dist'),

    /**
     * 每次构建前清空 dist 目录
     * 防止旧文件残留
     */
    clean: true,

    /**
     * 静态资源（图片、字体等）的输出路径和命名规则
     */
    assetModuleFilename: 'assets/[name][hash][ext]',
  },

  /**
   * 模块规则（Loader 配置）
   * 告诉 Webpack 如何处理不同类型的文件
   */
  module: {
    rules: [

      // ==================== JavaScript / JSX ====================
      {
        // 匹配 .js 和 .jsx 文件
        test: /\.(js|jsx)$/,

        // 排除 node_modules，提升构建速度
        exclude: /node_modules/,

        // 使用 Babel 转译 ES6+ / JSX
        use: 'babel-loader',
      },

      // ==================== CSS ====================
      {
        // 匹配 .css 文件
        test: /\.css$/,

        // Loader 执行顺序：从右到左
        // css-loader：解析 CSS 依赖
        // style-loader：把 CSS 注入到 DOM（开发环境）
        use: ['style-loader', 'css-loader'],
      },

      // ==================== 图片资源 ====================
      {
        // 匹配图片文件
        test: /\.(png|jpe?g|gif|svg|webp)$/,

        // Webpack 5 内置资源模块
        // asset/resource：输出独立文件
        type: 'asset/resource',
      },

      // ==================== 字体资源 ====================
      {
        // 匹配字体文件
        test: /\.(woff2?|eot|ttf|otf)$/,

        // 同样使用内置 Asset Modules
        type: 'asset/resource',
      },
    ],
  },

  /**
   * 插件配置（Plugins）
   * 用于执行 Loader 做不到的事情
   */
  plugins: [

    // 生成 HTML 文件，并自动引入打包后的 JS / CSS
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '..', 'public/index.html'),
    }),
  ],
};