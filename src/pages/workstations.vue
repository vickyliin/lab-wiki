<template>
  <v-flex>
    <v-flex v-if="status == 0" row class="text-xs-center">
      <v-progress-circular :indeterminate="true"></v-progress-circular>
    </v-flex>
    <template v-else-if="status == 200">
      <v-data-table
          :headers="headers"
          :items="items"
          hide-actions
          class="elevation-1"
          :pagination.sync="pagination"
      >
        <template slot="headers" scope="props">
          <tr>
            <th v-for="header in props.headers" :key="header.value"
                :class="['column sortable',
                 pagination.descending? 'desc':'asc',
                 header.value === pagination.sortBy ? 'active' : '',
                 header.value]"
                @click="changeSort(header.value)">
              {{ header.text }}
              <v-icon>arrow_upward</v-icon>
            </th>
          </tr>
        </template>
        <template slot="items" scope="props">
          <td class="text-xs" :class="header.value"
              v-for="header in headers"><span>{{props.item[header.value]}}</span></td>
        </template>
      </v-data-table>
    </template>
    <template v-else>
      <p>
        <v-icon class="mr-1">error</v-icon>
        The data is unavailable now. Please <a :href="location.href">try again</a>
        later or contact our web administrator.
      </p>
    </template>
  </v-flex>
</template>
<script>
  import $ from 'ajax'
  import {entry} from 'config'

  export default {
    props: ['title'],
    data(){
      return {
        headers: 'server cpu cores clock mem gpu'.split(' ').map(value=>({text: value, value})),
        items: null,
        pagination: {
          sortBy: 'server',
          rowsPerPage: -1,
        },
        url: entry,
        loading: 0,
        location: window.location,
        status: 0,
      }
    },
    created(){
      $.get({
        url: this.url,
        type: 'json',
        ready: (data, status) => {
          if(status == 200){
            this.items = data.map(d => ({
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
    methods: {
      changeSort (column) {
        if (this.pagination.sortBy === column) {
          this.pagination.descending = !this.pagination.descending
        } else {
          this.pagination.sortBy = column
          this.pagination.descending = false
        }
      },
    }
  }
</script>
