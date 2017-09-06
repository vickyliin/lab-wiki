<template>
  <v-container>
    <h6>On duty this week: <b>{{ duty }}</b></h6>
    <v-layout column>
      <datatable v-bind="table" @sorted="items => this.sortedItems = items" @clickSort="sorting=true">
      </datatable>
    </v-layout>
  </v-container>
</template>

<script>
import { entry } from 'config'
import $ from 'ajax'
import datatable from 'components/datatable.vue'

export default {
  components: { datatable },
  data() {
    return {
      entry,
      table: {
        headers: [
          { value: 'date' },
          { value: 'contact' },
        ],
        items: [],
        initPagination: {
          sortBy: 'date',
          rowsPerPage: 10,
          descending: false
        },
        actions: true,
      },
      duty: '林瑋柔 God (Forever)',
    }
  },
  created() {
    this.pullData()
  },
  methods: {
    async setData(data) {
      console.log(data)
      this.table.items = data.map(d => ({
        date: `${new Date(d.startDate).toJSON().slice(0, 10)} ~ ${new Date(d.endDate).toJSON().slice(0, 10)}`,
        startDate: new Date(d.startDate),
        endDate: new Date(d.endDate),
        contact: d.contact.name,
      }))
      let now = new Date()
      for (let item of this.table.items) {
        if (item.startDate <= now && now <= item.endDate) {
          this.duty = `${item.contact} (${item.date})`
        }
      }
    },
  },
}
</script>