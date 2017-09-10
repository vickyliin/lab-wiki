<template>
  <v-container>
    <h6>On duty this week: <b>{{ duty }}</b></h6>
    <v-layout column>
      <datatable v-bind="table" class="garbage">
      </datatable>
    </v-layout>
  </v-container>
</template>

<script>
import datatable from 'components/datatable.vue'

export default {
  components: { datatable },
  data() {
    return {
      table: {
        headers: [
          { value: 'date' },
          { value: 'name', text: 'contact' },
        ],
        items: [],
        initPagination: {
          sortBy: 'date',
          rowsPerPage: 10,
          descending: false
        },
        actions: true,
        actionIcons: [
          {
            icon: 'phone',
            color: 'green',
            show: item => true,
            href: item => 'tel:' + item.contact.phone
          },
          {
            icon: 'email',
            color: 'grey',
            show: item => true,
            href: item => 'mailto:' + item.contact.email
          },
        ],
      },
    }
  },
  created() {
    this.crud()
  },
  methods: {
    setData(data) {
      this.table.items = data.map(d => ({
        date: {
          display: this.dateInterval([d.startDate, d.endDate]),
          sort: d.startDate
        },
        startDate: new Date(d.startDate),
        endDate: new Date(d.endDate),
        contact: d.contact,
        name: d.contact.name,
      }))
    },
  },
  computed: {
    duty(){
      let now = new Date()
      for (let item of this.table.items) {
        if (item.startDate <= now && now <= item.endDate) {
          return `${item.contact.name} (${item.date})`
        }
      }
    },
  },
}
</script>

<style lang="stylus">
  .garbage
    th, td
      &.date
        width: 15rem
    td.contact span
      &.phone
        font-size: smaller
        margin-left: 2rem
</style>
