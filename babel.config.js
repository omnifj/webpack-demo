module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false,        // ✅ 保留 ES Module
        targets: '> 0.25%, not dead',
      },
    ],
    '@babel/preset-typescript',
  ],
};