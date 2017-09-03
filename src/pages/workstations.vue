<template>
  <v-container>
    <datatable v-bind="table"></datatable>
  </v-container>
</template>
<script>
  import $ from 'ajax'
  import datatable from 'components/datatable.vue'
  import {wsDataEntry} from 'config'

  export default {
    components: {datatable},
    data(){
      return {
        table: {
          headers: 'server cpu cores clock mem gpu'.split(' '),
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
      this.pullData()
    },
    methods: {
      setData(data){
        this.table.items = data.map(d => ({
          server: d.hostname.replace(/nlg-wks-/, ''),
          cpu: d.cpuinfo.type.replace(/Intel|\(R\)|\(TM\)|CPU/g, ''),
          clock: d.cpuinfo.clock,
          cores: d.cpuinfo.cores,
          mem: parseInt(d.cpu.mem_total/1000),
          gpu: d.gpu.type,
        }))
      },
    },
  }
</script>
