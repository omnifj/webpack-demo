// eslint.config.js
const js = require('@eslint/js');
const globals = require('globals');

// ✅ 正确引入方式（CommonJS）
const react = require('eslint-plugin-react');
const reactHooks = require('eslint-plugin-react-hooks');

// TS 相关的插件和解析器
const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');

module.exports = [
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: tsParser, // 这里的 tsParser 需要你自己定义或引入 TypeScript 的解析器
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      react: react, //显式赋值
      'react-hooks': reactHooks,
    },
    rules: {
      ...js.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      ...reactHooks.configs.recommended.rules,
    },
  },
  {
    ignores: ['node_modules/**', 'dist/**', 'config/**'],
  },
];
