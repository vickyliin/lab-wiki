import Vue from 'vue'
import App from 'App.vue'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import {routerMode, timeLocaleFormat} from 'config'

import * as components from './pages/*.vue'

var routes = Object.entries(components).map(
    pair => ({path: '/'+pair[0], component: pair[1]})
)
const router = new VueRouter({
  routes,
  mode: routerMode,
})

Vue.use(Vuetify)
Vue.use(VueRouter)
Vue.filter('localeString', data => {
  if(data === undefined) return ''
  if(data.toLocaleString) return data.toLocaleString(timeLocaleFormat)
  else return data
})
Vue.filter('spaceSeparated', camelCased => camelCased
    .replace(/(\B[A-Z])/, ' $1')
    .replace(/^./, match => match.toUpperCase()))

new Vue({
  el: '#app',
  render: h => h(App),
  router
})
