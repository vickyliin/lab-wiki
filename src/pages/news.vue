<template>
  <v-container>
    <v-layout column>
      <transition-group name="slide-y" tag="div">
        <v-flex v-for="(news,i) in newsData" :key="i">
          <v-container>
            <h6>{{news.title}}</h6>
            <v-subheader>{{news.date | localeString}}</v-subheader>
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
      let n = 0
      let i = setInterval(()=>{
        this.pullData({n})
        n++
        if(n === 3) clearInterval(i)
      }, 50)
    },
    methods: {
      pullData(params){
        $.get({
          url: this.url,
          data: params,
          type: 'json',
          ready: (data, status) => {
            if(status === 200){
              data.date = new Date(data.date)
              this.newsData.push(data)
            }
          }
        })
      }
    },
    computed: {
      url(){
        return this.entry + this.$route.path
      }
    }
  }
</script>