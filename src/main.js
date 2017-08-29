import Vue from 'vue'
import App from 'App.vue'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import {routerMode, timeLocaleFormat, googleAuthClientID, entry} from 'config'

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

import 'assets/js/google.api-client'
import $ from 'ajax'
gapi.load('auth2', () => {
  var auth2 = gapi.auth2.init({
    client_id: googleAuthClientID,
    cookiepolicy: 'single_host_origin',
  })
  auth2.signIn()
  auth2.currentUser.listen(user => {
    $.post({
      url: entry + '/login',
      data: {
        id_token: user.getAuthResponse().id_token
      },
      ready: (data, status) => {
        if(status === 403){
          auth2.signOut()
          auth2.signIn()
        }
      }
    })
  })
})