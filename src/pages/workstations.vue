<template>
  <v-container>
    <v-flex v-if="status == 0" row class="text-xs-center">
      <v-progress-circular :indeterminate="true"></v-progress-circular>
    </v-flex>
    <template v-else-if="status == 200">
      <datatable v-bind="table"></datatable>
    </template>
    <template v-else>
      <p>
        <v-icon class="mr-1">error</v-icon>
        The data is unavailable now. Please <a :href="$route.path">try again</a>
        later or contact our web administrator.
      </p>
    </template>
  </v-container>
</template>
<script>
  import $ from 'ajax'
  import {entry} from 'config'

  import datatable from 'components/datatable.vue'

  export default {
    components: {datatable},
    data(){
      return {
        entry,
        table: {
          headers: 'server cpu cores clock mem gpu'.split(' '),
          items: [],
          initPagination: {
            sortBy: 'server',
            rowsPerPage: -1,
            descending: false
          },
        },
        status: 0,
      }
    },
    created(){
      $.get({
        url: this.url,
        type: 'json',
        ready: (data, status) => {
          if(status === 200){
            this.table.items = data.map(d => ({
              server: d.hostname.replace(/nlg-wks-/, ''),
              cpu: d.cpuinfo.type.replace(/Intel|\(R\)|\(TM\)|CPU/g, ''),
              clock: d.cpuinfo.clock,
              cores: d.cpuinfo.cores,
              mem: parseInt(d.cpu.mem_total/1000),
              gpu: d.gpu.type,
            }))
          }
          this.status = status
        },
      })
    },
    computed: {
      url(){
        return this.entry + this.$route.fullPath
      }
    }
  }
</script>
