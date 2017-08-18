<template>
  <v-app light>
    <v-navigation-drawer
      class="lighten-4 pb-0 pt-1"
      persistent floating clipped enableResizeWatcher
      light :scrollable="false"
      v-model="drawer"
      height="100%"
      id="sidebar"
    >
      <v-list dense>
        <template v-for="(item, i) in items">
          <router-link :to="item.path">
            <v-list-tile :key="i">
              <v-list-tile-action>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>
                  {{ item.text }}
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </router-link>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar fixed>
      <v-btn icon @click.native.stop="drawer = !drawer">
        <v-icon>menu</v-icon>
      </v-btn>
      <v-toolbar-title>
        Natural Language Processing Lab
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <main>
      <v-container fluid>
        <v-slide-y-transition mode="out-in">
          <router-view></router-view>
        </v-slide-y-transition>
      </v-container>
    </main>
  </v-app>
</template>

<script>

  import VueRouter from 'vue-router'
  import * as pageComponents from './pages/*.vue'
  var routes = Object.entries(pageComponents).map(
    pair => ({path: '/'+pair[0], component: pair[1]})
  )
  window.routes = routes
  const router = new VueRouter({
    routes,
    mode: 'history',
  })

  export default {
    data () {
      return {
        drawer: true,
        items: [
          {icon: 'highlight', text: 'News', path: 'news'},
          {icon: 'kitchen', text: 'Workstations', path: 'workstations'},
          {icon: 'toys', text: 'GPU Usage', path: 'gpuUsage'},
          {icon: 'local_library', text: 'Seminar', path: 'seminar'},
          {icon: 'perm_contact_calendar', text: 'Contact List', path: 'contactList'},
        ],
        title: 'NTU NLP Lab. Wiki'
      }
    },
    router
  }
</script>

<style lang="stylus">
  @import './stylus/main'
  #sidebar a
    text-decoration: none
  td, th
    vertical-align: middle
</style>

<style lang="stylus">

  .os, .cpu, .clock
    text-align: left
  .server, .memory
    text-align: center
  .cores, .mem, .loading, .temperature
    text-align: right

  th.column
    text-transform: uppercase
  td.os, td.server
    text-transform: capitalize

  td.server:before
    content: "wks-"
    text-transform: initial

  .mem_usage, .mem_tot
    width: 40%
    text-align: right
  td.clock>span
    min-width: 2rem
  td.clock>span, .mem_usage, .mem_tot
    display: inline-block

  td.clock:after
    content: "GHz"
  td.mem:after
    content: "GB"
  td.loading:after
    content: "%"
  td.temperature:after
    content: "\B0 C"
  .mem_usage, .mem_tot
    &:after
      content: "MB"
      padding-left: .3rem
  .mem_usage:after
      content: "MB /"

  td:after
    padding-left: .3rem
    color: #555
    font-size: smaller

</style>