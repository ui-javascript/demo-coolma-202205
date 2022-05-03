module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es6: true,
  },
  extends: [
    'plugin:vue/essential'
    // 是个讲究人的话还是加上规则校验吧!! 然而我喜欢浪~~
    // , '@vue/standard'
    // , '@vue/prettier'
  ],
  // vue-element-admin的校验规则
  // https://github.com/PanJiaChen/vue-element-admin/blob/master/.eslintrc.js
  // extends: ['plugin:vue/recommended', 'eslint:recommended'],
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // iview-admin放宽条件 ===========
    'vue/no-parsing-error': [2, {
      'x-invalid-end-tag': false
    }],
    'no-undef': 'off',
    'camelcase': 'off'

    // 'prettier/prettier': [
    //   'error',
    //   {
    //     semi: false,
    //     singleQuote: true
    //   }
    // ]
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
};
