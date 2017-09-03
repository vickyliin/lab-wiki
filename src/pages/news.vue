<template>
  <v-container>
    <v-layout column>
      <transition-group name="slide-y" tag="div">
        <v-flex v-for="(news,i) in newsData" :key="i">
          <v-container>
            <h6>{{news.title}}</h6>
            <v-subheader>{{news.date | date}}</v-subheader>
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
  import {entry} from 'config'
  import VueMarkdown from 'vue-markdown'
  import $ from 'ajax'

  export default{
    components: {VueMarkdown},
    data(){
      return {
        entry,
        newsData: []
      }
    },
    created(){
      this.pullData()
    },
    methods: {
      async setData(data){
        for(let d of data.slice(0,10)){
          d.date = new Date(d.date)
          this.newsData.push(d)
          await this.$nextTick()
        }
      },
    },
  }
</script>