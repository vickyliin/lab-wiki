import Vue from 'vue'
import {
  Vuetify,
  VApp
} from 'vuetify'
import App from 'App.vue'
import router from 'router'
import store from 'store'
import 'composition'

Vue.use(Vuetify, {
  components: {
    VApp,
  }
})

new Vue({ // eslint-disable-line
  el: '#app',
  render: h => h(App),
  router,
  store
})
