import Vue from 'vue'
import VueRouter from 'vue-router'
import {routerMode} from 'config'

Vue.use(VueRouter)

import * as components from './pages/*.vue'

const pages = Object.entries(components).map(
    ([name, component]) => ({
      path: '/'+name,
      component,
      name,
    })
)

export default new VueRouter({
  routes: [
    {
      path: '/',
      redirect: '/gpuUsage',
    },
    ...pages,
  ],
  mode: routerMode,
  scrollBehavior: (to ,from, savePosition) => savePosition? savePosition: {x:0,y:0}
})