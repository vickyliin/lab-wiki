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
    'vue/mustache-interpolation-spacing': [2, 'always'],
    'vue/attribute-hyphenation': [2, 'always'],
    'vue/name-property-casing': [2, 'kebab-case'],
    'vue/no-multi-spaces': 2,
    'vue/v-on-style': [2, 'shorthand'],
    'vue/html-self-closing': 2,
    'vue/html-indent': [2, 2]
  }
};
