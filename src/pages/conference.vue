<template>
  <v-container>
    <v-layout column>
      <datatable v-bind="table">
      </datatable>
    </v-layout>
    <post-dialog v-bind="dialog"
                 v-model="dialog.value">
    </post-dialog>
  </v-container>
</template>

<script>
import { entry } from 'config'
import $ from 'ajax'
import datatable from 'components/datatable.vue'
import postDialog from 'components/post-dialog.vue'

export default {
  components: { datatable, postDialog },
  data() {
    return {
      table: {
        headers: [
          { value: 'name' },
          { value: 'when' },
          { value: 'where' },
          { value: 'deadline' },
        ],
        items: [],
        initPagination: {
          sortBy: 'name',
          rowsPerPage: 10,
          descending: false
        },
      },
      dialog: {
        title: 'Search for Conference',
        fields: [
          {
            name: 'q',
            label: 'Conference name',
            icon: 'mdi-timetable',
            required: true,
            component: 'conference-selector',
          }
        ],
        width: '25rem',
      },
    }
  },
  created() {
    this.pullData()
  },
  methods: {
    async setData(data) {
      this.table.items = data.map(d => ({
        name: d.name,
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
  },
}
</script>
