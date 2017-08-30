import Vue from 'vue'
import VueRouter from 'vue-router'
import {routerMode} from 'config'

Vue.use(VueRouter)

import * as components from './pages/*.vue'

export default new VueRouter({
  routes: Object.entries(components).map(
      pair => ({path: '/'+pair[0], component: pair[1]})
  ),
  mode: routerMode,
})