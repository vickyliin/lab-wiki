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
    <datatable v-bind="table">
    </datatable>
    <post-dialog :title="dialog.title"
                 :fields="dialog.fields"
                 :display.sync="dialog.display"
                 v-model="dialog.value"
                 @submit="dialog.onSubmit"
                 @activate="beforeCreateData"
                 width="35rem">
    </post-dialog>
  </v-container>
</template>

<script>

  import _ from 'lodash'
  import {mapGetters} from 'vuex'
  import {entry, gDriveSlidesFolderID, gSuiteDomain} from 'config'
  import $ from 'ajax'
  import datatable from 'components/datatable.vue'
  import postDialog from 'components/post-dialog.vue'

  export default {
    components: {datatable, postDialog},
    data(){
      return {
        table: {
          search: '',
          headers: [
            {value: 'date'},
            {value: 'presenter'},
            {value: 'topic', display: (value, text) =>
                text + (value.slides? ` <a href="${value.slides}" target="_blank">Slide</a>`: '')},
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
              action: item => this.beforeUpdateData(item),
            },
          ]
        },
        search: '',
        dialog: {
          title: null,
          fields: [
            {name: 'date', label: 'Date', required: true, component: 'date-picker'},
            {name: 'presenter', label: 'Presenter', required: true, icon: 'account_circle', component: 'member-selector'},
            {name: 'slide', label: 'Slide', icon: 'slideshow', component: 'file-picker'},
            {name: 'topic', label: 'Topic', multiLine: true, component: 'v-text-field'}
          ],
          value: null,
          onSubmit: x => x,
          display: false,
          item: null,
        },
      }
    },
    created(){
      this.pullData()
    },
    methods: {
      setData(data){
        this.table.items = data.map(d => ({
          date: new Date(d.date).toJSON().slice(0, 10),
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
      uploadFile(file){
        const boundary = '-------henry_is_god__henrygod_is_god';
        const delimiter = `\r\n--${boundary}\r\n`;
        const closeDelim = `\r\n--${boundary}--`;

        return new Promise(resolve => {
          let reader = new FileReader()

          reader.readAsBinaryString(file)
          reader.onload = () => {
            let metadata = {
              name: file.name,
              parents: gDriveSlidesFolderID, // Upload to 'slides'
              mimeType: file.type+'\r\n'
            }
            let fileContent = btoa(reader.result) //base64 encoding
            // BJ4
            let multipartRequestBody = delimiter +
              'Content-Type: application/json\r\n\r\n' +
              JSON.stringify(metadata) + delimiter +
              'Content-Type: ' + `${file.type}\r\n` +
              'Content-Transfer-Encoding: base64\r\n\r\n' +
              fileContent + closeDelim

            gapi.client.request({
                'path': '/upload/drive/v3/files',
                'method': 'POST',
                'params': {
                    'uploadType': 'multipart'
                },
                'headers': {
                    'Content-Type': `multipart/related; boundary="${boundary}"`,
                    'Content-Length': multipartRequestBody.length
                },
                'body': multipartRequestBody
            }).then(response => resolve(response))
          }
        })
      },
      beforeCreateData(){
        Object.assign(this.dialog, {
          title: 'Add Seminar',
          value: null,
          onSubmit: this.updateData,
          item: null
        })
      },
      async beforeUpdateData(item){
        Object.assign(this.dialog, {
          title: 'Update Seminar',
          value: {
            date: item.date,
            presenter: item.presenter,
            slide: null,
            topic: item.topic.text
          },
          onSubmit: this.updateData,
          item
        })
        await this.$nextTick()
        this.dialog.display = true
      },
      async updateData(resolve){
        let data = this.serverFormatData
        let {slide} = this.dialog.value
        if(slide){
          let {result, status} = await this.uploadFile(slide)
          if(status === 200){
            data.slides = `https://drive.google.com/open?id=${result.id}`
          }
        }
        let itemID = this.dialog.item? this.dialog.item.id : ''
        await $.post({url: `${entry}${this.model}/${itemID}`, data})
        this.setData(await this.getData(this.model))
        resolve()
      },
      editable(item){
        return item.owner === this.userEmail || this.userRole === 'admin'
      },
    },
    computed: {
      serverFormatData(){
        let {date, presenter, topic} = this.dialog.value
        let {item} = this.dialog
        return {
          date,
          slides: item? item.topic.slides : '',
          topic: topic || '',
          presenter: presenter.name,
          owner: presenter.account + '@' + gSuiteDomain
        }
      },
      ...mapGetters(['userEmail']),
    },
    watch: {
      search: _.debounce(function(){
        this.table.search = this.search
      }, 500),
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