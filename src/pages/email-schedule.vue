<template>
  <v-container>
    <v-layout mb-3>
      <v-spacer></v-spacer>
      <v-text-field
          append-icon="search"
          label="Search (support regex)"
          single-line
          hide-details
          v-model="search"
      ></v-text-field>
    </v-layout>
    <datatable v-bind="table"
               v-model="table.value"
               :pagination.sync="table.pagination">
    </datatable>
    <form-dialog :title="dialog.title"
                 :fields="dialog.fields"
                 :display.sync="dialog.display"
                 v-model="dialog.value"
                 @submit="dialog.onSubmit"
                 @activate="beforeCreateData"
                 width="35rem">
    </form-dialog>
  </v-container>
</template>

<script>

import debounce from 'lodash.debounce'
import { mapGetters } from 'vuex'
import { entry } from 'config'
import $ from 'ajax'
import datatable from 'components/datatable.vue'
import formDialog from 'components/form-dialog.vue'

export default {
  components: { datatable, formDialog },
  data () {
    return {
      table: {
        search: '',
        headers: [
          { value: 'time' },
          { value: 'mailto' },
          { value: 'subject' },
          { value: 'body' },
          { value: 'status' }
        ],
        items: [],
        pagination: {
          sortBy: 'status',
          rowsPerPage: 10
        },
        actions: true,
        actionIcons: [
          {
            icon: 'edit',
            color: 'teal',
            show: item => !item.isSent,
            action: item => this.beforeUpdateData(item)
          }
        ],
        selectAll: true,
        enableSelect: false,
        value: []
      },
      search: '',
      dialog: {
        title: null,
        fields: [
          {
            name: 'mailto',
            label: 'Mail to',
            required: true,
            icon: 'email',
            component: 'v-text-field',
            rules: [
              v => !!v || '',
              v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
            ]
          },
          { name: 'subject', label: 'Subject', required: true, icon: 'border_color', component: 'v-text-field' },
          { name: 'body', label: 'Body', required: true, icon: 'empty', multiLine: true, component: 'v-text-field' },
          { name: 'time', label: 'Time', component: 'date-picker' }
        ],
        value: null,
        onSubmit: x => x,
        display: false,
        item: null
      }
    }
  },
  created () {
    this.crud()
  },
  mounted () {
    this.table.enableSelect = this.isAdmin
  },
  methods: {
    setData (data) {
      this.table.items = data.map(d => ({
        time: new Date(d.execTime).toJSON().slice(0, 10),
        mailto: d.mailto,
        subject: d.subject,
        body: d.body,
        status: d.isSent ? 'Sent' : 'Pending',
        isSent: d.isSent,
        id: d.id
      }))
    },
    beforeCreateData () {
      Object.assign(this.dialog, {
        title: 'Add Email',
        value: null,
        onSubmit: this.updateData,
        item: null
      })
    },
    async beforeUpdateData (item) {
      Object.assign(this.dialog, {
        title: 'Update Email',
        value: item,
        onSubmit: this.updateData,
        item
      })
      await this.$nextTick()
      this.dialog.display = true
    },
    async updateData (resolve) {
      let data = this.serverFormatData
      let itemID = this.dialog.item ? this.dialog.item.id : ''
      await $.post({ url: `${entry}${this.model}/${itemID}`, data })
      this.setData(await this.getData(this.model))
      resolve()
    }
  },
  computed: {
    serverFormatData () {
      let { mailto, subject, body, time } = this.dialog.value
      return {
        execTime: time || new Date(),
        mailto,
        subject,
        body
      }
    },
    ...mapGetters(['userEmail'])
  },
  watch: {
    search: debounce(function () {
      this.table.search = this.search
    }, 500),
    userRole (newVal) {
      this.table.enableSelect = this.isAdmin
    }
  }
}
</script>

<style lang="stylus">
  td.time
    width: 9rem
    text-align: center
  td.body
    width: 18rem
</style>
