<template>
  <v-navigation-drawer class="pb-0 pt-1"
                       app
                       floating
                       clipped
                       persistent
                       enable-resize-watcher
                       :value="value"
                       @input="e => $emit('input', e)"
                       id="sidebar">
    <v-list dense>
      <template v-for="(item, i) in items">
        <v-divider v-if="item === 'divider'"
                   :key="i"></v-divider>
        <v-subheader v-else-if="item.header"
                     :key="i">
          {{ item.header }}
        </v-subheader>
        <router-link :to="item.path"
                     :key="i"
                     v-else>
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
  props: ['value'],
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
  td, th
    vertical-align: middle
  .router-link-active>li
    background-color: #303030
</style>
