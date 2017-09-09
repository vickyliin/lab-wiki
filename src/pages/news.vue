<template>
  <v-container>
    <v-layout column>
      <transition-group name="slide-y" tag="div">
        <v-flex v-for="(news,i) in displayData" :key="i">
          <v-container>
            <h6>{{news.title}}</h6>
            <v-subheader>{{news.date | localeString('Date')}}</v-subheader>
            <v-container>
              <vue-markdown>{{news.content}}</vue-markdown>
            </v-container>
            <v-divider></v-divider>
          </v-container>
        </v-flex>
      </transition-group>
    </v-layout>
  </v-container>
</template>

<script>
  import VueMarkdown from 'vue-markdown'
  import $ from 'ajax'

  export default{
    components: {VueMarkdown},
    data(){
      return {
        data: []
      }
    },
    created(){
      this.crud()
    },
    methods: {
      async setData(data){
        this.data = data
      },
    },
    computed: {
      displayData(){
        return this.data.slice(0, 10)
      }
    }
  }
</script>
