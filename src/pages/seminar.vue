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
    <datatable v-bind="table"></datatable>
  </v-container>
</template>

<script>

  import {entry} from 'config'
  import $ from 'ajax'
  import datatable from 'components/datatable.vue'
  import _ from 'lodash'

  export default {
    components: {datatable},
    data(){
      return {
        entry,
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
      }
    },
    created(){
      this.pullData()
    },
    methods: {
      setTableItems(data){
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
      async pullData(){
        let {response, status} = await $.get({
          url: this.url,
          type: 'json',
        })
        this.$store.commit('status', status)
        if(status !== 200) return
        this.setTableItems(response)
      },
    },
    computed: {
      url(){
        return this.entry + this.$route.fullPath
      }
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