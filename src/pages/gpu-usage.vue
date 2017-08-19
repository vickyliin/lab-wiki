<template>
  <v-flex>
    <v-flex v-if="status == 0" row class="text-xs-center">
      <v-progress-circular :indeterminate="true"></v-progress-circular>
    </v-flex>
    <template v-else-if="status == 200">
      <v-flex row class="mb-3 text-xs">
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
              <span v-for="value in header.display" :class="value">{{props.item[value] | localeString}}</span>
            </template>
            <span v-else :class="header.value">
        {{props.item[header.value] | localeString}}
      </span>
          </td>
        </template>
      </v-data-table>
    </template>
    <v-flex v-else row class="v-center">
      <p>
        <v-icon class="mr-1">error</v-icon>
        The GPU usage data is unavailable now. Please <a :href="location.href">try again</a>
        later or contact our web administrator.
      </p>
    </v-flex>
  </v-flex>
</template>

<script>
  import $ from 'ajax'
  import {entry} from 'config'
  export default {
    data(){
      let headers = [
        {text: 'server', value: 'wks'},
        {value: 'gpu'},
        {value: 'loading'},
        {text: 'memory', value: 'mem_rest', display: ['mem_usage', 'mem_tot']},
        {value: 'temp'},
      ]
      for(let header of headers)
        if(!header.text) header.text = header.value
      return {
        headers,
        items: [],
        pagination: {
          sortBy: 'loading',
          rowsPerPage: -1,
        },
        url: entry,
        lastUpdate: null,
        status: 0,
        pulling: false,
        interval: null,
        queryInterval: 600000,
        location: window.location
      }
    },
    created(){
      this.pullData((data, status)=> this.status = status)
      this.interval = setInterval(this.pullData, this.queryInterval)
    },
    destroyed(){
      clearInterval(this.interval)
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
            if(onready) onready(data, status)
            if(status == 200){
              try{
                for(var d of data){
                  d.loading = parseInt(100*d.loading)
                  d.mem_rest = d.mem_tot - d.mem_usage
                }
                this.items = data
                this.lastUpdate = new Date()
              }
              catch(e){
                console.log(e)
                this.status = -1
              }
            }
          }
        })
      },
    }
  }
</script>

<style lang="stylus" scoped>
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