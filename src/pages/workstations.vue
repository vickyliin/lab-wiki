<template>
  <v-container class="workstation">
    <datatable
      v-bind="table"
      :pagination.sync="table.pagination"/>
  </v-container>
</template>
<script>
import datatable from 'components/datatable.vue'

export default {
  components: {datatable},
  data () {
    return {
      table: {
        headers: 'server os cpu cores clock mem gpu ssh'.split(' '),
        items: [],
        loading: true,
        pagination: {
          sortBy: 'server',
          rowsPerPage: -1,
          descending: false
        },
        value: []
      }
    }
  },
  created () {
    this.crud()
  },
  methods: {
    setData (data) {
      this.table.items = data.map(d => ({
        id: d.hostname,
        server: d.hostname.replace(/nlg-wks-/, ''),
        cpu: d.cpuinfo.type.replace(/Intel|\(R\)|\(TM\)|CPU/g, ''),
        clock: d.cpuinfo.clock,
        cores: d.cpuinfo.threads,
        mem: parseInt(d.cpu.mem_total / 1000),
        gpu: {
          display: d.gpu.map(gpu => gpu.type).join(',<br>')
        },
        os: {
          display: d.os // prevent from parsed to date
        },
        ssh: d.ssh,
        logtime: new Date(d.logtime)
      }))
      this.table.loading = false
      this.selectDead()
    },
    selectDead () {
      this.table.value = []
      this.table.items.forEach(d => {
        if (d.logtime < Date.now() - 300000) {
          this.table.value.push(d)
        }
      })
    }
  }
}
</script>

<style lang="stylus">
  .workstation table.table tr
    td, th
      padding: 0 1rem
</style>
