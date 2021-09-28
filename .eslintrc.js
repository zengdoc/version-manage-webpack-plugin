module.exports = {
  parser: "babel-eslint",
  rules: {
    "arrow-parens": ["error", "as-needed"],
    "no-use-before-define": ["error", { "functions": false }],
    "no-underscore-dangle": ["error", { "allowAfterThis": true }],
    "no-restricted-syntax": 0,
  }
}
