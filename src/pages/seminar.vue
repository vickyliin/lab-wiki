<template>
  <v-container>
    <datatable v-bind="table">

    </datatable>
  </v-container>
</template>

<script>

  import {entry} from 'config'
  import $ from 'ajax'
  import datatable from 'components/datatable.vue'

  export default {
    components: {datatable},
    data(){
      return {
        entry,
        table: {
          search: '',
          headers: [
            { value: 'date' },
            { value: 'presenter' },
            { value: 'topic' },
          ],
          items: [],
        },
      }
    },
    created(){
      this.pullData()
    },
    methods: {
      pullData(){
        $.get({
          url: this.url,
          type: 'json',
          ready: (data, status) => {
            if(status === 200){
              this.table.items = data.map(d => {
                let date = new Date(d.date)
                return {
                  date: Object.assign(date.valueOf(), {
                    display: [
                      {name: 'QAQ', value: date.toJSON().slice(0,10)}
                    ]
                  }),
                  presenter: d.presenter,
                  topic: d.topic,
                };
              })
            }
          }
        })
      },
    },
    computed: {
      url(){
        return this.entry + '/seminar'
      }
    },
  }
</script>
