<template>
  <v-container>
    <v-layout mb-3 v-if="userRole === 'admin'">
      <v-spacer></v-spacer>
      <v-text-field
          append-icon="search"
          label="Search, eg. NLP"
          single-line
          hide-details
          v-model="search"
      ></v-text-field>
    </v-layout>
    <v-layout column>
      <datatable v-bind="table">
      </datatable>
    </v-layout>
  </v-container>
</template>

<script>
import { entry } from 'config'
import _ from 'lodash'
import $ from 'ajax'
import datatable from 'components/datatable.vue'

export default {
  components: { datatable },
  data() {
    return {
      search: '',
      table: {
        headers: [
          {
            value: 'name',
            display: (item, text) =>
                `<a href="${item.url}" target="_blank">${text}</a>`
          },
          { value: 'when' },
          { value: 'where' },
          { value: 'deadline' },
        ],
        items: [],
        initPagination: {
          sortBy: 'deadline',
          rowsPerPage: 10,
          descending: false
        },
        loading: true,
        actions: true,
        actionIcons: [
          {
            icon: 'add',
            color: 'primary',
            show: item => item.unsaved,
            action: item => this.createData(item),
          }
        ],
      },
      items: {
        saved: [],
        unsaved: []
      },
    }
  },
  created() {
    this.pullData()
  },
  methods: {
    async setData(data) {
      this.table.items = this.items.saved = data.map(d => ({
        name: {
          text: d.name,
          url: d.url
        },
        when: {
          start: new Date(d.start),
          sort: new Date(d.start).valueOf(),
          end: new Date(d.end),
          display: d.when
        },
        where: d.where,
        deadline: {
          sort: new Date(d.deadline).valueOf(),
          display: d.deadlineDisplay
        },
      }))
    },
    async searchData(q){
      if(!q){
        this.items.unsaved = []
        return
      }
      this.pulling = true
      let data = await this.getData('/cfpSearch', {q})
      if(!data) return
      this.items.unsaved = data.map(d => ({
        name: {
          display: d.name,
          sort: 0,
          colspan: 4,
        },
        unsaved: 1,
        cfpUrl: d.cfpUrl,
      }))
      this.pulling = false
    },
    async createData(item){
      let data = {
        name: item.name.display,
        cfpUrl: item.cfpUrl
      }
      await $.post({url: `${entry}${this.model}`, data})
    },
  },
  watch: {
    search: _.debounce(function(newVal){
      this.searchData(newVal)
    }, 500),
    'items.unsaved': function(unsaved){
      let {saved} = this.items
      this.table.items = saved.concat(unsaved)
    },
    pulling(newVal){
      this.table.loading = newVal
    },
  },
}
</script>
