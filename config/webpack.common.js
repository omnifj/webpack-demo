// 引入 Node.js 内置模块
const fs = require('fs');
const path = require('path');

// 引入 HtmlWebpackPlugin
// 作用：根据模板自动生成 HTML，并把打包后的 JS / CSS 自动注入
const HtmlWebpackPlugin = require('html-webpack-plugin');

// 项目根目录
const rootDir = path.resolve(__dirname, '..');

// 任务演示目录
const taskRoot = path.resolve(rootDir, 'src', 'task');

// 通过 --path 参数构建独立任务时，构建脚本会写入 BUILD_TASK
const currentTask = process.env.BUILD_TASK || '';
const isTaskBuild = Boolean(currentTask);

// 读取所有任务目录，例如 task1、task2
const taskNames = fs
  .readdirSync(taskRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);

if (isTaskBuild && !taskNames.includes(currentTask)) {
  throw new Error(
    `未知任务 "${currentTask}"，可选任务：${taskNames.join('、')}`
  );
}

// 默认构建时，把每个任务作为一个独立入口
const taskEntries = Object.fromEntries(
  taskNames.map((taskName) => [
    `task/${taskName}/index`,
    path.resolve(taskRoot, taskName, 'index.tsx'),
  ])
);

/**
 * 生成 HTML 插件：
 * - 指定任务构建：只输出当前任务的 index.html
 * - 完整构建：输出主页面、每个任务页面以及 home.html
 */
const htmlPlugins = isTaskBuild
  ? [
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: path.resolve(taskRoot, currentTask, 'index.html'),
      }),
    ]
  : [
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: path.resolve(rootDir, 'public/index.html'),
        chunks: ['main'],
      }),
      ...taskNames.map(
        (taskName) =>
          new HtmlWebpackPlugin({
            filename: `task/${taskName}/index.html`,
            template: path.resolve(taskRoot, taskName, 'index.html'),
            chunks: [`task/${taskName}/index`],
          })
      ),
      new HtmlWebpackPlugin({
        filename: 'home.html',
        template: path.resolve(rootDir, 'public/home.html'),
        chunks: [],
      }),
    ];

// Webpack 配置入口
module.exports = {
  /**
   * 入口文件（Entry Point）
   * - 默认：主应用 + 所有任务
   * - 指定任务：只构建该任务的入口文件
   */
  entry: isTaskBuild
    ? path.resolve(taskRoot, currentTask, 'index.tsx')
    : {
        main: path.resolve(rootDir, 'src/index.tsx'),
        ...taskEntries,
      },

  /**
   * 输出配置（Output）
   */
  output: {
    /**
     * 输出的 JS 文件名
     * [name]：入口名称
     * [contenthash]：文件内容变化时 hash 才会变（利于浏览器缓存）
     */
    filename: isTaskBuild
      ? 'bundle.[contenthash].js'
      : 'js/[name].[contenthash].js',

    /**
     * 输出目录
     * - 默认：dist
     * - 指定任务：dist/task/{任务名}
     */
    path: isTaskBuild
      ? path.resolve(rootDir, 'dist', 'task', currentTask)
      : path.resolve(rootDir, 'dist'),

    /**
     * 每次构建前清空输出目录
     * 指定任务时只会清空该任务的目录，不影响其他任务
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
        test: /\.(js|jsx|ts|tsx)$/,

        // 排除 node_modules，提升构建速度
        exclude: /node_modules/,

        // 使用 Babel 转译 ES6+ / JSX
        use: 'babel-loader',
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

  // 模块解析配置 导入文件时，哪些后缀可以省略
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
  },

  /**
   * 插件配置（Plugins）
   * 用于执行 Loader 做不到的事情
   */
  plugins: [...htmlPlugins],
};
