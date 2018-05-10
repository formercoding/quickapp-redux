const lint = require('@mi/eslint-config-mcfe-base').default
module.exports = {
  extends: lint,
  rules: {
    // add project level rules if need.
  },
  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": "module"
  },
}
