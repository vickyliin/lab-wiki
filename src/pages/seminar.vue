<template>
  <v-container>
    <v-layout>
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
    <v-dialog width="35rem" v-model="newEntryDialog">
      <v-btn fab small fixed primary bottom right slot="activator">
        <v-icon>add</v-icon>
      </v-btn>
      <v-card>
        <v-card-title>
          <v-container class="headline" fluid>
            New Seminar
          </v-container>
        </v-card-title>
        <v-card-text>
          <v-container fluid>
            <v-layout column>
              <date-picker label="Date"
                           :required="required.date"
                           :error="error.date"
                           v-model="newEntry.date"></date-picker>
              <member-selector label="Presenter" icon="account_circle"
                               :required="required.presenter"
                               :error="error.presenter"
                               v-model="newEntry.presenter"></member-selector>
              <file-picker label="Slide" icon="slideshow"
                           :required="required.slide"
                           :error="error.slide"
                           v-model="newEntry.slide"></file-picker>
              <v-text-field label="Topic"
                            multi-line :error="error.topic"
                            :required="required.topic"
                            v-model="newEntry.topic"></v-text-field>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat @click="clearForm(newEntry)">Clear</v-btn>
          <v-btn flat primary @click="postNewEntry" :loading="posting.newEntry">Submit</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>

  import _ from 'lodash'
  import {entry, gDriveSlidesFolderID, gClientSettings} from 'config'
  import $ from 'ajax'
  import datatable from 'components/datatable.vue'
  import filePicker from 'components/file-picker.vue'
  import datePicker from 'components/date-picker.vue'
  import memberSelector from 'components/member-selector.vue'

  export default {
    components: {datatable, filePicker, datePicker, memberSelector},
    data(){
      return {
        table: {
          search: '',
          headers: [
            {value: 'date'},
            {value: 'presenter'},
            {value: 'topic', display: (value, text) => text.replace(/slide/gi,
                ` <a href="${value.slides}" target="_blank">Slide</a>`) },
          ],
          items: [],
          initPagination: {
            sortBy: 'date',
            rowsPerPage: 10,
            descending: true
          },
          actions: true,
        },
        search: '',
        newEntry: {
          date: null,
          presenter: null,
          topic: null,
          slide: null
        },
        required: {
          date: true,
          presenter: true,
          topic: false,
          slide: false
        },
        newEntryDialog: false,
        posting: {
          newEntry: false,
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
      clearForm(data){
        for(let key in data){
          data[key] = null
        }
      },
      async postNewEntry(){
        this.posting.newEntry = true
        if(!this.validate) return
        let data = {
          slides: '',
          presenter: this.newEntry.presenter.name,
          date: this.newEntry.date,
          topic: this.newEntry.topic || '',
          owner: this.newEntry.presenter.account + gClientSettings
        }
        if(this.newEntry.slide){
          let {result, status} = await this.uploadFile(this.newEntry.slide)
          if(status === 200){
            data.slides = `https://drive.google.com/open?id=${result.id}`
            data.topic += ' Slide'
          }
        }
        await $.post({url: entry + this.model, data})
        this.newEntryDialog = false
        this.posting.newEntry = false
        this.setData(await this.getData(this.model))
        this.clearForm(this.newEntry)
      }
    },
    computed: {
      error(){
        let error = {}
        Object.entries(this.required).forEach(([field, required]) => {
          error[field] = required && !this.newEntry[field]
        })
        return error
      },
      validate(){
        return !Object.values(this.error).every(x=>x)
      },
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