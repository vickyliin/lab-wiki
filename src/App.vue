<template>
  <v-app dark>
    <navigator v-model="drawer"></navigator>
    <toolbar v-model="drawer"></toolbar>
    <page></page>
  </v-app>
</template>

<script>
  import page from 'page.vue'
  import navigator from 'components/navigator.vue'
  import toolbar from 'components/toolbar.vue'

  export default {
    components: { navigator, toolbar, page },
    data() {
      return {
        drawer: true,
      }
    },
    created() {
      this.$store.dispatch('gAuthInit')
    },
  }
</script>

<style src="mdi/css/materialdesignicons.min.css"></style>
<style lang="stylus">
  @import './stylus/main'
  .os, .cpu, .clock
    text-align: left
  .server, .memory, .gpu
    text-align: center
  .cores, .mem, .fan, .temp
    td^[0]
      text-align: center
    &>span
      text-align: right
      min-width 2em
      display: inline-block

  th.column
    text-transform: uppercase

  .mem_usage, .mem_tot
    min-width: 5em
    text-align: right
  td.clock>span
    min-width: 2.2em
  td.clock>span, .mem_usage, .mem_tot
    display: inline-block

  td>span.server:before
    content: "wks-"
  td.clock:after
    content: "GHz"
  td.mem:after
    content: "GB"
  td.fan:after
    content: "%"
  td.temp:after
    content: "\B0 C"
  .mem_usage, .mem_tot
    &:after
      content: "MB"
      padding-left: .3em
  .mem_usage:after
      content: "MB /"
</style>
