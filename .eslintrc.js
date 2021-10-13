module.exports = {
  parser: "babel-eslint",
  rules: {
    "semi": ["error", "never"],
    "comma-dangle": ["error", "never"],
    "arrow-parens": ["error", "as-needed"],
    "no-use-before-define": ["error", { "functions": false }],
    "no-underscore-dangle": ["error", { "allowAfterThis": true }],
    "no-restricted-syntax": 0,
  }
}
