<template>
  <v-navigation-drawer
    id="sidebar"
    :value="value"
    class="pb-0 pt-1"
    app
    floating
    clipped
    temporary
    hide-overlay
    enable-resize-watcher
    @input="e => $emit('input', e)">
    <v-list dense>
      <template v-for="(item, i) in items">
        <v-divider
          v-if="item === 'divider'"
          :key="i"/>
        <v-subheader
          v-else-if="item.header"
          :key="i">
          {{ item.header }}
        </v-subheader>
        <router-link
          v-else
          :to="item.path"
          :key="i">
          <v-list-tile>
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>
                {{ item.path | spaceSeparated }}
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </router-link>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      items: [
        { header: 'Computers' },
        { icon: 'toys', path: 'gpuUsage' },
        { icon: 'memory', path: 'cpuUsage' },
        { icon: 'kitchen', path: 'workstations' },
        'divider',
        { header: 'Meetings' },
        { icon: 'local_library', path: 'seminar' },
        { icon: 'mdi-timetable', path: 'conference' },
        'divider',
        { header: 'Others' },
        { icon: 'highlight', path: 'news' },
        { icon: 'mdi-broom', path: 'cleanOurLab' },
        { icon: 'perm_contact_calendar', path: 'contactList' }
        // {icon: 'email', path: 'emailSchedule'},
      ]
    }
  }
}
</script>

<style lang="stylus">
  #sidebar a
    text-decoration: none
    color: #fff
  td, th
    vertical-align: middle
  .router-link-active>div
    background-color: #303030
</style>
