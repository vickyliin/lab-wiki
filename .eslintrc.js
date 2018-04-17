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
  },
  rules: {
    'vue/html-indent': [2, 2],
    'vue/html-self-closing': [2, {
      html: {
        void: 'never',
        normal: 'always',
        component: 'always'
      },
      svg: 'always',
      math: 'always'
    }]
  }
};
