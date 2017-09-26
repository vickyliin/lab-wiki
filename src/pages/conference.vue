<template>
  <v-container>
    <v-layout mb-3
              v-if="isAdmin">
      <v-spacer></v-spacer>
      <v-text-field append-icon="search"
                    label="Search and Add Conference to list"
                    placeholder="NLP"
                    hide-details
                    v-model="search"></v-text-field>
    </v-layout>
    <v-layout column>
      <datatable v-bind="table"
                 :pagination.sync="table.pagination">
      </datatable>
    </v-layout>
  </v-container>
</template>

<script>
import _ from 'lodash'
import datatable from 'components/datatable.vue'

const searchPath = '/search'

export default {
  components: { datatable },
  data () {
    return {
      search: '',
      table: {
        highlightText: '',
        headers: [
          {
            value: 'name',
            display: ({ url }, text) => url
              ? `<a href="${url}" target="_blank">${text}</a>` : text
          },
          { value: 'when' },
          { value: 'where' },
          { value: 'deadline' }
        ],
        items: [],
        pagination: {
          sortBy: 'deadline',
          rowsPerPage: -1,
          descending: false
        },
        loading: true,
        actions: true,
        actionIcons: [
          {
            icon: 'add',
            color: 'primary',
            show: item => item.unsaved,
            action: item => this.createData(item)
          },
          {
            icon: 'delete',
            color: 'grey',
            show: item => !item.unsaved && this.isAdmin,
            action: item => this.deleteData(item)
          }
        ]
      },
      items: {
        saved: {},
        unsaved: {}
      }
    }
  },
  created () {
    this.crud()
  },
  methods: {
    setData (data, target = 'saved') {
      this.items[target] = {}
      let unsaved = target === 'unsaved' ? 1 : 0
      for (let d of data) {
        this.$set(this.items[target], d.name, {
          id: d.id,
          cfpUrl: d.cfpUrl,
          name: {
            text: d.name,
            url: d.url,
            display: unsaved ? d.name : undefined
          },
          when: {
            display: this.dateInterval([d.start, d.end]),
            sort: d.start || d.end || ''
          },
          where: d.where,
          deadline: d.deadlineDisplay,
          unsaved,
          raw: d
        })
      }
    },
    async searchData (q) {
      if (!q) {
        this.items.unsaved = {}
        return
      }
      let data = await this.crud({ path: this.model + searchPath, data: { q } })
      this.setData(data, 'unsaved')
      Object.assign(this.table.pagination, {
        sortBy: 'unsaved',
        descending: true
      })
    },
    async createData (item) {
      await this.crud({ type: 'create', data: item.raw })
      this.$delete(this.items.unsaved, name)
    },
    deleteData (item) {
      this.crud({ type: 'delete', id: item.id })
    }
  },
  computed: {
    tableItems () {
      let { saved, unsaved } = this.items
      return Object.values({ ...unsaved, ...saved })
    }
  },
  watch: {
    search: _.debounce(async function (newVal) {
      await this.searchData(newVal)
      this.table.highlightText = newVal
    }, 800),
    tableItems (items) {
      this.table.items = items
    },
    pulling (newVal) {
      this.table.loading = newVal
    }
  }
}
</script>
