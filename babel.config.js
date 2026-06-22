module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false, // ✅ 关键：保留 ES Module
        targets: '> 0.25%, not dead',
      },
    ],
  ],
};