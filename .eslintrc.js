// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'standard',
    'plugin:vue/recommended',
    'eslint:recommended'
  ],
  plugins: [
    'vuetify'
  ],
  // add your custom rules here
  rules: {
    'no-multi-spaces': 'off',
    'camelcase': ['warn', {
      'properties': 'never'
    }],
    // allow async-await
    'generator-star-spacing': 'off',

    'indent': 'off',
    'vue/script-indent': ['error', 2, {
      'baseIndent': 1,
      'switchCase': 1
    }],

    'vue/singleline-html-element-content-newline': 'off',
    'vue/no-mutating-props': 'off',

    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  },
  parserOptions: {
    parser: 'babel-eslint',
    ecmaFeatures: {
      legacyDecorators: true
    }
  }
}
