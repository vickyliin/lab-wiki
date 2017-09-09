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
               v-model="table.value">
    </datatable>
    <form-dialog :title="dialog.title"
                 :fields="dialog.fields"
                 :display.sync="dialog.display"
                 v-model="dialog.value"
                 @submit="dialog.onSubmit"
                 width="35rem">
    </form-dialog>
    <managePanel :dialog="dialog" :dialogs="dialogs"
                 :selected="table.value"
                 :setData="setData"></managePanel>
  </v-container>
</template>

<script>

  import _ from 'lodash'
  import { mapGetters } from 'vuex'
  import { gDriveSlidesFolderID, gSuiteDomain } from 'config'
  import datatable from 'components/datatable.vue'
  import formDialog from 'components/form-dialog.vue'
  import managePanel from 'components/manage-panel.vue'

  const boundary = '-------henry_is_god__henrygod_is_soooooo_god'
  const multipartRequestBody = ({boundary, metadata, fileType, fileContent}) =>
`
--${boundary}
Content-Type: application/json

${JSON.stringify(metadata)}
--${boundary}
Content-Type: ${fileType}
Content-Transfer-Encoding: base64

${fileContent}
--${boundary}--`

  export default {
    components: { datatable, formDialog, managePanel },
    data() {
      return {
        table: {
          search: '',
          headers: [
            { value: 'date' },
            { value: 'presenter' },
            {
              value: 'topic', display: (value, text) =>
                text + (value.slides ? ` <a href="${value.slides}" target="_blank">Slide</a>` : '')
            },
          ],
          items: [],
          initPagination: {
            sortBy: 'date',
            rowsPerPage: 10,
            descending: true
          },
          actions: true,
          actionIcons: [
            {
              icon: 'mode_edit',
              color: 'teal',
              show: item => this.editable(item),
              action: item => {
                this.dialogs.item = item
                Object.assign(this.dialog, this.dialogs.update)
              },
            },
          ],
          selectAll: false,
          enableSelect: false,
          value: [],
        },
        search: '',
        dialog: {
          title: null,
          fields: [
            { name: 'date', label: 'Date', required: true, component: 'date-picker' },
            { name: 'presenter', label: 'Presenter', required: true, icon: 'account_circle', component: 'member-selector' },
            { name: 'slide', label: 'Slide', icon: 'slideshow', component: 'file-picker' },
            { name: 'topic', label: 'Topic', multiLine: true, component: 'v-text-field' }
          ],
          value: null,
          onSubmit: x => x, //initialize
          display: false,
          item: null,
        },
        dialogs: {
          item: {topic: {}},
          updateData: this.updateData,
          localeString: this.localeString,
          create: {
            title: 'Add Seminar',
            value: null,
            item: null,
            onSubmit: this.updateData,
            display: true,
          },
          get update(){
            let item = this.item
            return {
              title: 'Update Seminar',
              value: {
                date: item.date,
                presenter: item.presenter,
                slide: null,
                topic: item.topic.text,
              },
              item,
              onSubmit: this.updateData,
              display: true,
            }
          },
        },
      }
    },
    created() {
      this.crud()
    },
    mounted() {
      this.table.enableSelect = this.userRole === 'admin'
    },
    methods: {
      setData(data) {
        this.table.items = data.map(d => ({
          date: d.date,
          presenter: d.presenter,
          topic: {
            sort: d.topic,
            text: d.topic,
            slides: d.slides,
          },
          owner: d.owner,
          id: d.id,
        }))
      },
      async uploadFile(file) {
        let reader = new FileReader()
        reader.readAsBinaryString(file)
        await new Promise(resolve => reader.onload = resolve)
        let metadata = {
          name: file.name,
          parents: gDriveSlidesFolderID, // Upload to 'slides'
          mimeType: file.type
        }
        let fileContent = btoa(reader.result) //base64 encoding

        return await gapi.client.request({
          path: '/upload/drive/v3/files',
          method: 'POST',
          params: {
            uploadType: 'multipart'
          },
          headers: {
            'Content-Type': `multipart/related; boundary="${boundary}"`,
          },
          body: multipartRequestBody({
            boundary,
            fileType: file.type,
            fileContent,
            metadata
          })
        })
      },
      async updateData(resolve) {
        let data = this.serverFormatData
        let { slide } = this.dialog.value
        if (slide) {
          let { result, status } = await this.uploadFile(slide)
          if (status === 200) {
            data.slides = `https://drive.google.com/open?id=${result.id}`
          }
        }
        let id = this.dialog.item ? this.dialog.item.id : undefined
        await this.crud({type: 'post', data, id})
        resolve()
      },
      editable(item) {
        return item.owner === this.userEmail || this.userRole === 'admin'
      },
    },
    computed: {
      serverFormatData() {
        let { date, presenter, topic } = this.dialog.value
        let { item } = this.dialog
        return {
          date,
          slides: item ? item.topic.slides : '',
          topic: topic || '',
          presenter: presenter.name,
          owner: presenter.account + '@' + gSuiteDomain
        }
      },
      ...mapGetters(['userEmail']),
    },
    watch: {
      search: _.debounce(function() {
        this.table.search = this.search
      }, 500),
      userRole(newVal) {
        this.table.enableSelect = newVal === 'admin'
      },
    }
  }
</script>

<style lang="stylus">
  td.date
    width: 9rem
    text-align: center
  td.presenter
    text-align: center
</style>
