<template>
  <v-container>
    <v-subheader class="px-2 mb-1">
      <v-layout wrap>
        <div class="mr-2">On duty this week:</div>
        <v-flex>{{ duty }}</v-flex>
      </v-layout>
    </v-subheader>
    <v-layout column>
      <datatable
        v-bind="table"
        :pagination.sync="table.pagination"
        class="garbage"/>
    </v-layout>
    <scheduleDialog
      v-bind="scheduleDialog"
      @submit="data => setData(data)"
      @update:display="d => { scheduleDialog.display = d }" />
    <manage-panel v-bind="managePanel" />
  </v-container>
</template>

<script>
import datatable from 'components/datatable.vue'
import managePanel from 'components/manage-panel.vue'
import scheduleDialog from 'components/schedule-dialog.vue'

export default {
  components: { datatable, managePanel, scheduleDialog },
  data () {
    return {
      table: {
        headers: [
          'date',
          { value: 'name', text: 'contact' }
        ],
        loading: true,
        items: [],
        pagination: {
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
          }
        ]
      },
      managePanel: {
        show: () => true,
        buttons: [{
          name: 'schedule',
          icon: 'mdi-calendar',
          color: 'success',
          action: () => {
            this.scheduleDialog.display = true
          }
        }],
        setData: this.setData,
        selected: []
      },
      scheduleDialog: {
        display: false,
        title: 'Cleaner Schedule',
        idField: 'garbageId',
        target: '/garbage',
        width: '30rem'
      }
    }
  },
  computed: {
    duty () {
      let now = new Date()
      for (let item of this.table.items) {
        if (item.startDate <= now && now < item.endDate.valueOf() + 86400000) {
          return `${item.contact.name} (${item.date.display})`
        }
      }
    },
    model: () => '/takeOutGarbage'
  },
  created () {
    this.crud()
  },
  methods: {
    setData (data) {
      this.table.items = data.map(d => ({
        date: {
          display: this.dateInterval([d.startDate, d.endDate]),
          sort: d.startDate
        },
        startDate: new Date(d.startDate),
        endDate: new Date(d.endDate),
        contact: d.contact,
        name: d.contact.name
      }))
      this.table.loading = false
    }
  }
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
