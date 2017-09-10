<template>
  <v-container class="workstation">
    <datatable v-bind="table"></datatable>
  </v-container>
</template>
<script>
  import datatable from 'components/datatable.vue'

  export default {
    components: {datatable},
    data(){
      return {
        table: {
          headers: 'server os cpu cores clock mem gpu ssh'.split(' '),
          items: [],
          initPagination: {
            sortBy: 'server',
            rowsPerPage: -1,
            descending: false
          },
        },
      }
    },
    created(){
      this.crud()
    },
    methods: {
      setData(data){
        this.table.items = data.map(d => ({
          server: d.hostname.replace(/nlg-wks-/, ''),
          cpu: d.cpuinfo.type.replace(/Intel|\(R\)|\(TM\)|CPU/g, ''),
          clock: d.cpuinfo.clock,
          cores: d.cpuinfo.threads,
          mem: parseInt(d.cpu.mem_total/1000),
          gpu: d.gpu.type,
          os: {
            display: d.os // prevent from parsed to date
          },
          ssh: d.ssh
        }))
      },
    },
  }
</script>

<style lang="stylus">
  .workstation table.table tr
    td, th
      padding: 0 1rem
</style>

