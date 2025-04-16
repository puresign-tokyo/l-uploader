// frontend/app/.eslintrc.js
module.exports = {
    root: true,
    parser: '@babel/eslint-parser',
    parserOptions: {
      requireConfigFile: false,
      babelOptions: {
        configFile: './babel.config.js',
      },
    },
    env: {
      browser: true,
      es2021: true,
    },
    extends: ['plugin:vue/vue3-recommended'],
    rules: {
      // 好きなルールをここに
    },
  };