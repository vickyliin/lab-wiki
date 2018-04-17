module.exports = {
  plugins: [
    'vue'
  ],
  extends: [
    'standard',
    'plugin:vue/recommended'
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: 'babel-eslint'
  },
  globals: {
    gapi: false,
    Chart: false
  }
};
