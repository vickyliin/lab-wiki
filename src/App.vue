<template>
  <v-app dark>
    <v-navigation-drawer
      class="pb-0 pt-1"
      persistent floating clipped enableResizeWatcher
      :scrollable="false"
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
                  {{ item.path | spaceSeparated}}
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
    <page></page>
  </v-app>
</template>

<script>

  import page from 'page.vue'

  export default {
    data () {
      return {
        drawer: true,
        items: [
          {icon: 'highlight', path: 'news'},
          {icon: 'kitchen', path: 'workstations'},
          {icon: 'toys', path: 'gpuUsage'},
          {icon: 'local_library', path: 'seminar'},
          {icon: 'perm_contact_calendar', path: 'contactList'},
        ],
        title: 'NTU NLP Lab. Wiki',
      }
    },
    components: {page}
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
  .server, .memory, .gpu
    text-align: center
  .cores>span
    padding-right: 1rem
  .cores, .mem, .loading, .temp
    text-align: right
    &:after
      padding-right: 1rem

  th.column
    text-transform: uppercase

  .mem_usage, .mem_tot
    width: 40%
    text-align: right
  td.clock>span
    min-width: 2rem
  td.clock>span, .mem_usage, .mem_tot
    display: inline-block

  td.server:before
    content: "wks-"
  td.clock:after
    content: "GHz"
  td.mem:after
    content: "GB"
  td.loading:after
    content: "%"
  td.temp:after
    content: "\B0 C"
  .mem_usage, .mem_tot
    &:after
      content: "MB"
      padding-left: .3rem
  .mem_usage:after
      content: "MB /"


</style>