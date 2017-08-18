<template>
  <v-layout>
    <v-flex fluid>
      <v-subheader class="pb-2">Workstations</v-subheader>
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
              :class="['column sortable', pagination.descending? 'desc':'asc', header.value === pagination.sortBy ? 'active' : '', header.text]"
              @click="changeSort(header.value)">
              {{ header.text }}
              <v-icon>arrow_upward</v-icon>
            </th>
          </tr>
        </template>
        <template slot="items" scope="props">
          <td class="text-xs" :class="header.text"
              v-for="header in headers"><span>{{props.item[header.value]}}</span></td>
        </template>
      </v-data-table>
    </v-flex>
  </v-layout>
</template>
<script>
  import csv from 'assets/workstations.csv'
  

  var items = [],
      lines = csv.split(/\s*\n\s*/),
      headers = lines.splice(0,1)[0].split(',').map(
        value => ({text: value, value})
      )
  for(var row of lines.slice(0,-1)){
    var item = {}
    row.split(',').forEach((col, i) => item[headers[i].value] = col)
    items.push(item)
  }

  export default {
    data(){
      return {
        headers,
        items,
        pagination: {
          sortBy: 'server',
          rowsPerPage: -1,
        },
      }
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
