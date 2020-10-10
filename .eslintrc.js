module.exports = {
  root: true,

  env: {
    node: true
  },

  parserOptions: {
    parser: 'babel-eslint'
  },

  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    indent: 'off'
  },

  extends: [
    'plugin:vue/recommended',
    '@vue/standard'
  ]
}
