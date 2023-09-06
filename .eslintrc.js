module.exports = {
  root: true,
  extends: ['airbnb-base'],
  parserOptions: {
    ecmaVersion: 2021,
  },
  env: {
    browser: true,
  },
  rules: {
    'no-alert': 0,
    'no-param-reassign': [2, { props: false }],
    'no-plusplus': 0,
    'no-iterator': 0,
    'no-restricted-syntax': [2, 'WithStatement'],
    'func-style': 0,
    'operator-linebreak': ['error', 'before'],
    'no-use-before-define': [
      'error',
      { functions: false, classes: true, variables: true, hoist: 'functions' },
    ],
  },
};
