<template>
  <v-container>
    <v-layout mb-3 v-if="userRole === 'admin'">
      <v-spacer></v-spacer>
      <v-text-field
          append-icon="search"
          label="Search and Add Conference to list"
          placeholder="NLP"
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

  const searchPath = '/cfpSearch'

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
            },
          ],
        },
        items: {
          saved: {},
          unsaved: {}
        },
      }
    },
    created() {
      this.pullData()
    },
    methods: {
      async setData(data, target='saved') {
        this.items[target] = {}
        let unsaved = target === 'unsaved'
        for(let d of data){
          this.$set(this.items[target], d.name, {
            id: d.id,
            cfpUrl: d.cfpUrl,
            name: {
              text: d.name,
              url: d.url,
              display: unsaved? d.name : undefined,
            },
            when: {
              display: d.when || null,
              sort: d.start || '',
            },
            where: d.where,
            deadline: d.deadlineDisplay,
            unsaved,
          })
        }
      },
      async searchData(q) {
        if (!q) {
          this.items.unsaved = {}
          return
        }
        this.pulling = true
        let data = await this.getData(searchPath, { q })
        this.setData(data, 'unsaved')
        this.pulling = false
      },
      async createData(item) {
        let name = item.name.display
        let data = {
          name,
          cfpUrl: item.cfpUrl,
        }
        await $.post({ url: `${entry}${this.model}`, data })
        this.$delete(this.items.unsaved, name)
        this.pullData()
      },
    },
    computed: {
      tableItems() {
        let {saved, unsaved} = this.items
        return Object.values({...unsaved, ...saved})
      },
    },
    watch: {
      search: _.debounce(function(newVal) {
        this.searchData(newVal)
      }, 800),
      tableItems(items) {
        this.table.items = items
      },
      pulling(newVal) {
        this.table.loading = newVal
      },
    },
  }
</script>
