import Vue from 'vue'
import VueRouter from 'vue-router'
import {routerMode} from 'config'
import * as components from './pages/*.vue'

Vue.use(VueRouter)

const pages = Object.entries(components).map(
  ([name, component]) => ({
    path: '/' + name,
    component,
    name
  })
)

export default new VueRouter({
  routes: [
    {
      path: '/',
      redirect: '/gpuUsage'
    },
    ...pages
  ],
  mode: routerMode,
  scrollBehavior: (to, from, savePosition) => savePosition || {x: 0, y: 0}
})
