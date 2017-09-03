<template>
  <v-container>
    <v-layout>
      <v-spacer></v-spacer>
      <v-text-field
          append-icon="search"
          label="Search"
          single-line
          hide-details
          v-model="search"
      ></v-text-field>
    </v-layout>
    <transition-group name="slide-y" tag="div" class="layout" id="contact-layout">
      <v-card v-for="person in filteredData" :key="person.name" class="contact-card">
        <v-container>
          <h6>{{person.name}}</h6>
          <v-divider></v-divider>
          <v-list>
            <v-list-tile v-for="field in fields" :key="field.name" :href="field.href? field.href(person[field.name]): undefined">
              <v-list-tile-action>
                <v-icon>{{field.icon}}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                {{person[field.name]}}
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-container>
      </v-card>
    </transition-group>
  </v-container>
</template>
<script>
  import $ from 'ajax'
  import _ from 'lodash'
  import {entry} from 'config'

  export default{
    data(){
      return {
        entry,
        contactData: [],
        fields: [
          {name: 'account', icon: 'account_circle'},
          {name: 'email', icon: 'email'},
          {name: 'phone', icon: 'phone', href: phone => 'tel:'+phone}
        ],
        search: '',
        debouncedSearch: '',
      }
    },
    created(){
      this.pullData()
    },
    methods: {
      async pullData(){
        let {response, status} = await $.get({
          url: this.url,
          type: 'json',
        })
        this.$store.commit('status', status)
        this.setContactData(response)
      },
      async setContactData(data){
        if(!data) return
        for(let d of data){
          this.contactData.push(d)
          await this.$nextTick()
        }
      },
    },
    computed: {
      url(){
        return this.entry + this.$route.fullPath
      },
      filteredData(){
        return this.contactData.filter(person => {
          for(let key in person){
            if(person[key].toString().indexOf(this.debouncedSearch) !== -1)
              return true
          }
          return false
        })
      },
    },
    watch: {
      search: _.debounce(function(){
        this.debouncedSearch = this.search
      }, 500)
    },
  }
</script>

<style lang="stylus">
  #contact-layout
    flex-wrap: wrap
    justify-content: space-around
  .contact-card
    flex-basis: 25rem
    margin: 2rem
    >.container>.layout
      align-items: center
    .list__tile
      height: 2.3rem
      font-size: inherit
    h6
      font-weight: normal
</style>