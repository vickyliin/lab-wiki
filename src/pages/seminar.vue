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
    <v-dialog width="30rem">
      <v-btn fab small fixed primary bottom right slot="activator">
        <v-icon>add</v-icon>
      </v-btn>
      <v-card>
        <v-card-title>
          <span class="headline">New Seminar</span>
        </v-card-title>
        <v-card-text>
          <v-container fluid>
            <v-layout column>
              <date-picker label="Date"
                           required
                           v-model="newEntry.date"></date-picker>
              <member-selector label="Presenter"
                               icon="account_circle"
                               required
                               v-model="newEntry.presenter"></member-selector>
              <file-picker label="Slide"
                           icon="slideshow"
                           v-model="newEntry.slide"></file-picker>
              <v-text-field label="Topic" multi-line v-model="newEntry.topic">
              </v-text-field>
            </v-layout>
          </v-container>
        </v-card-text>
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
    },
    watch: {
      search: _.debounce(function(){
        this.table.search = this.search
      }, 500)
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