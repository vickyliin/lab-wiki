import Vue from 'vue'
import Vuetify from 'vuetify'
import App from 'App.vue'
import router from 'router'
import store from 'store'
import 'filter'
import 'mixins'

Vue.use(Vuetify)

new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store
})
