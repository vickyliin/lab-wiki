module.exports = {
  extends: [
    'standard',
    'plugin:vue/recommended'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  globals: {
    gapi: true
  },
  rules: {
    'vue/mustache-interpolation-spacing': [2, 'always'],
    'vue/attribute-hyphenation': [2, 'always'],
    'vue/name-property-casing': [2, 'kebab-case'],
    'vue/no-multi-spaces': 2,
    'vue/v-on-style': [2, 'shorthand']
  }
};
