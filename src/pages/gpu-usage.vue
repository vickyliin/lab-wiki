<template>
  <v-layout>
    <v-flex fluid>
      <v-subheader class="pb-2">GPU Usage</v-subheader>
      <v-data-table
          :headers="headers"
          :items="items"
          hide-actions
          class="elevation-1"
          :pagination.sync="pagination"
        >
        <template slot="headers" scope="props">
          <tr>
            <th v-for="header in props.headers" :key="header.text"
              :class="['column sortable',
                       pagination.descending? 'desc':'asc',
                       header.value === pagination.sortBy ? 'active' : '',
                       header.text]"
              @click="changeSort(header.value)">
              {{ header.text }}
              <v-icon>arrow_upward</v-icon>
            </th>
          </tr>
        </template>
        <template slot="items" scope="props">
          <td class="text-xs" :class="header.text"
              v-for="header in headers">
            <template v-if="header.display">
              <span v-for="value in header.display" :class="value">{{props.item[value].toLocaleString()}}</span>
            </template>
            <span v-else :class="header.value">
              {{props.item[header.value].toLocaleString()}}
            </span>
          </td>
        </template>
      </v-data-table>
    </v-flex>
  </v-layout>
</template>

<script>
  import $ from 'ajax'
  var headers = [
    {text: 'server', value: 'wks'},
    {value: 'gpu'},
    {value: 'loading'},
    {text: 'memory', value: 'mem_rest', display: ['mem_usage', 'mem_tot']},
    {text: 'temperature', value: 'temp'},
  ]
  for(let header of headers){
    if(!header.text) header.text = header.value
  }
  export default {
    data(){
      return {
        headers,
        items: [],
        pagination: {
          sortBy: 'loading',
          rowsPerPage: -1,
        },
        url: 'https://250d08bc.ngrok.io/vicky_is_god',
      }
    },
    created(){
      this.pullData()
    },
    methods: {
      changeSort(column) {
        if (this.pagination.sortBy === column) {
          this.pagination.descending = !this.pagination.descending
        } else {
          this.pagination.sortBy = column
          this.pagination.descending = false
        }
      },
      pullData(){
        $.get({
          url: this.url,
          type: 'json',
          ready: (data, status) => {
            if(status == 200){
              for(var d of data){
                d.loading = parseInt(100*d.loading)
                d.mem_rest = d.mem_tot - d.mem_usage
              }
              this.items = data
            }
          }
        })
      },
    }
  }
</script>

<style lang="stylus">
  .gpu
    text-align: center
</style>