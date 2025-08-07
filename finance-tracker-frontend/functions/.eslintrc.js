module.exports = {
  root: true,
  env: {
    es6: true,
    node: true, // This is essential for recognizing Node.js globals
  },
  extends: [
    'eslint:recommended',
  ],
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    quotes: ['error', 'single'],
    // Add specific rules to allow Node.js globals without a warning
    'no-undef': 'off', // Turn off the rule that flags 'module', 'require', 'exports'
  },
};
