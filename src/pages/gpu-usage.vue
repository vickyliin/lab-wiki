<template>
  <v-layout>
    <v-flex fluid>
      <v-subheader class="pb-2">
        GPU Usage
      </v-subheader>
      <v-flex v-if="status == 'loading'" row class="text-xs-center">
        <v-progress-circular :indeterminate="true"></v-progress-circular>
      </v-flex>
      <template v-else-if="status == 'success'">
        <v-flex row class="pb-3 pl-3 pt-2 text-xs">
          Last Update: {{lastUpdate.toLocaleString()}}
          <v-icon class="ml-1 link"
                  :class="{rotate: pulling}"
                  @click="if(pulling) return
                          pulling = true;
                          pullData(()=>pulling = false)">refresh</v-icon>
        </v-flex>
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
      </template>
      <v-flex v-else row class="ml-3">
        <v-icon>error</v-icon>
        The GPU usage data is unavailable now. Please try again later or contact our web administrator.
      </v-flex>
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
        lastUpdate: null,
        status: 'loading',
        pulling: false,
      }
    },
    created(){
      this.pullData((data, status)=> this.status = (status == 200? 'success':'error'))
      setInterval(this.pullData, 600000)
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
      pullData(onready){
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
              this.lastUpdate = new Date()
            }
            if(onready) onready(data, status)
          }
        })
      },
    }
  }
</script>

<style lang="stylus" scoped>
  .gpu
    text-align: center
  animation()
    -webkit-animation arguments
    -moz-animation arguments
    animation arguments
  .rotate
    animation rotate .5s linear infinite
    cursor: default
  @keyframes rotate{
      100% {
        -webkit-transform: rotate(360deg)
        transform: rotate(360deg)
      }
  }
</style>