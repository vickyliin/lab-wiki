<template>
  <v-container>
    <datatable v-bind="table"></datatable>
  </v-container>
</template>
<script>
  import $ from 'ajax'

  import datatable from 'components/datatable.vue'

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
    methods: {
      setItems(data){
        this.items = data.map(d => ({
          server: d.hostname.replace(/nlg-wks-/, ''),
          cpu: d.cpuinfo.type.replace(/Intel|\(R\)|\(TM\)|CPU/g, ''),
          clock: d.cpuinfo.clock,
          cores: d.cpuinfo.cores,
          mem: parseInt(d.cpu.mem_total/1000),
          gpu: d.gpu.type,
        }))
      }
    }
  }
</script>
