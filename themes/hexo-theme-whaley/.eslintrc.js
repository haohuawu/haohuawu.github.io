// http://eslint.org/docs/user-guide/configuring
module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  extends: 'airbnb-base',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // check if imports actually resolve
  'settings': {
    'html/indent': '+2',
    'import/resolver': {
      'webpack': {
        'config': 'webpack.base.config.js'
      }
    }
  },
  // add your custom rules here
  'rules': {
    'comma-dangle': ['error', 'never'],
    'import/extensions': ['error', 'always', {
      'js': 'never'
    }],
    // allow console during development
    'no-console': process.env.NODE_ENV === 'production' ? 2 : 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}
