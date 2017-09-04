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
    <v-dialog width="35rem">
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
          <v-btn flat primary @click="postNewEntry">Submit</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>

  import _ from 'lodash'
  import {entry} from 'config'
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
      async uploadFile(file){
        const boundary = '-------vicky_is_god__duckingod_is_god';
        const delimiter = `\r\n--${boundary}\r\n`;
        const close_delim = `\r\n--${boundary}--`;

        return new Promise((resolve, reject) => {
          let reader = new FileReader()

          reader.readAsBinaryString(file)
          reader.onload = () => {
            let metadata = {
              name: file.name,
              parents: ['0B0PoejLXnl7lU2kyN21UVzFrTk0'], // Upload to 'slides'
              mimeType: file.type+'\r\n'
            }
            let fileContent = btoa(reader.result) //base64 encoding
            // BJ4
            let multipartRequestBody = delimiter +
              'Content-Type: application/json\r\n\r\n' +
              JSON.stringify(metadata) + delimiter +
              'Content-Type: ' + `${file.type}\r\n` +
              'Content-Transfer-Encoding: base64\r\n\r\n' +
              fileContent + close_delim

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
      postNewEntry(){
        if(!this.validate) return
        // This part is terribly coded by Henry, plz forgive me vickygod :(
        let data = {
          slides: '',
          presenter: this.newEntry.presenter.name,
          date: this.newEntry.date,
          topic: this.newEntry.topic || ''
        }
        if(this.newEntry.slide){
          this.uploadFile(this.newEntry.slide).then(resp => {
            if(resp.status === 200){
              let slide_url = `https://drive.google.com/open?id=${resp.result.id}`
              console.log(slide_url)
              data.slides = slide_url
              data.topic += ' Slide'
              console.log(JSON.stringify(data))
              $.post({url: entry + '/seminar', data: data}).then()
            }
          })
        } else{
          $.post({url: entry + '/seminar', data: data}).then()
        }
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