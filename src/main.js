import Vue from 'vue'
import App from 'App.vue'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'

Vue.use(Vuetify)
Vue.use(VueRouter)

new Vue({
  el: '#app',
  render: h => h(App)
})
