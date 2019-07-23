// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  // https://github.com/standard/standard/blob/master/docs/RULES-en.md
  extends: [
    // 'standard'
    'plugin:vue/recommended'
  ],
  // required to lint *.vue files
  plugins: [
    // 'html'
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

    'vuetify/no-deprecated-classes': 'error',
    // 'vuetify/grid-unknown-attributes': 'error',
    // 'vuetify/no-legacy-grid': 'error',

    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  },

  parserOptions: {
    parser: 'babel-eslint',
    ecmaFeatures: {
      legacyDecorators: true
    }
  }
}
