import Vue from 'vue'
import {
  Vuetify,
  VApp,
  VBtn,
  VIcon,
  VGrid,
  VDataTable,
  VCheckbox,
  VMenu,
  VTextField,
  VDatePicker,
  VDialog,
  VCard,
  VTooltip,
  VSelect,
  VList,
  VNavigationDrawer,
  VDivider,
  VSubheader,
  VToolbar,
  VAvatar,
  VProgressCircular
} from 'vuetify'
import App from 'App.vue'
import router from 'router'
import store from 'store'
import 'composition'
import 'stylus/main.styl'

Vue.use(Vuetify, {
  components: {
    VApp,
    VBtn,
    VIcon,
    VGrid,
    VDataTable,
    VCheckbox,
    VMenu,
    VTextField,
    VDatePicker,
    VDialog,
    VCard,
    VTooltip,
    VSelect,
    VList,
    VNavigationDrawer,
    VDivider,
    VSubheader,
    VToolbar,
    VAvatar,
    VProgressCircular
  }
})

new Vue({ // eslint-disable-line
  el: '#app',
  render: h => h(App),
  router,
  store
})
