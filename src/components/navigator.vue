<template>
  <v-navigation-drawer
      class="pb-0 pt-1"
      floating persistent enable-resize-watcher
      :value="value"
      @input="e => $emit('input', e)"
      height="100%"
      id="sidebar">
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
</template>

<script>
  export default{
    props: ['value'],
    data(){return {
      items: [
        {icon: 'toys', path: 'gpuUsage'},
        {icon: 'kitchen', path: 'workstations'},
        {icon: 'local_library', path: 'seminar'},
        {icon: 'perm_contact_calendar', path: 'contactList'},
        {icon: 'highlight', path: 'news'},
        {icon: 'delete', path: 'takeOutGarbage'},
        {icon: 'mdi-timetable', path: 'conference'},
      ],
    }},
  }
</script>

<style lang="stylus">
  #sidebar a
    text-decoration: none
  td, th
    vertical-align: middle
  .router-link-active>li
    background-color: #303030
  .navigation-drawer__border
    width: 0
</style>