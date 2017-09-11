# Lab WIKI

This is a [Vue.js](https://vuejs.org/) webapp, developing with module bundler [Webpack](https://webpack.js.org/).


## Getting start

- Download [node.js](https://nodejs.org/en/)

- Clone this repository

- In the directory, run
  ```
  npm install
  ```
  to install dependencies.

- Start the webpack-dev-server:
  ```
  npm run dev
  ```

- Download [Vue.js Devtool chrome extension](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)

- Visit your `localhost:12345`


## Application Starting Flow

After

```
npm run dev
```

- Webpack finds `webpack.config.js`, in which designating the entry file `/src/main.js`.
  ```javascript
  entry: ['babel-polyfill', './src/main.js']
  ```


- In `main.js`, a Vue instance is created, rendering the root component defined in `/src/App.vue`.
  ```javascript
  import App from 'App.vue'
  new Vue({
    el: '#app',
    render: h => h(App),
    router,
    store
  })
  ```

- In `App.vue`, the skeleton of the web view is defined, including `navigator`, `toolbar` and `page`.
  ```javascript
  import page from 'page.vue'
  import navigator from 'components/navigator.vue'
  import toolbar from 'components/toolbar.vue'
  ```


## Application Structure

```
src\
  assets\           static files
  components\       reusable vue components
  pages\            page components
  store\            vuex store
  stylus\           main style
```


## References

- [Vuex](https://vuex.vuejs.org/)
- [Vue-Router](https://router.vuejs.org/)
- [Stylus](http://stylus-lang.com/)
- [ES5](http://babeljs.io/learn-es2015/)
- [ES6](http://es6-features.org/)


## Features

### Google Authentication

- Sign In :heavy_check_mark:
- Check Role :heavy_check_mark:

### Contact List

- Display :heavy_check_mark:
- Search/Highlight :heavy_check_mark:
- Add, Update, Remove

### GPU Usage

- Table :heavy_check_mark:
- Chart :heavy_check_mark:
- Multiple GPU in one machine

### Workstations :heavy_check_mark:

- Table :heavy_check_mark:

### CPU/MEM Usage

- Table :heavy_check_mark:
- Chart :heavy_check_mark:

### News

- Display :heavy_check_mark:
- Pagination
- Add, Update, Remove

### Seminar

- Table :heavy_check_mark:
- Search, Highlight :heavy_check_mark:
- Admin Add, Update, Remove :heavy_check_mark:
- Owner Update :heavy_check_mark:
- Highlight Changed Rows
- Postpone, advance, exchange dates
- Google Drive Upload :heavy_check_mark:

### Take out garbage

- Table :heavy_check_mark:

### Call for Papers

- Table :heavy_check_mark:
- Add: search from [WikiCFP](http://www.wikicfp.com/cfp/) :heavy_check_mark:
- Remove :heavy_check_mark:
- Update: the same conference update to latest edition
